import { Router } from 'express';
import { createUserSchema, loginUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from '../../db/userSchema.js';
import { validateData } from '../../middleware/validationMiddleware.js';
import { db } from "../../db/index.js";
import { usersTable } from '../../db/userSchema.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { EmailService } from '../../services/email.service.js';
import { generateVerificationCode, isVerificationCodeValid } from '../../utils/verification.js';

const router = Router();
const emailService = new EmailService();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;

router.post('/register', validateData(createUserSchema), async (req, res) => {
    try {
        const data = req.cleanBody;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;

        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Generate verification code
        const verificationCode = generateVerificationCode();

        // Create user with verification code
        const [user] = await db.insert(usersTable).values({
            ...data,
            emailVerificationCode: verificationCode
        }).returning();

        // Send verification email
        await emailService.sendEmailVerification(user.email, verificationCode);

        // Send admin notification
        const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
        if (adminEmails.length > 0) {
          await emailService.sendNewUserNotification(adminEmails, user.email, user.name);
        }

        const { password, ...userWithoutPassword } = user;
        const token = jwt.sign(
            { userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE },
            JWT_SECRET as string,
            { expiresIn: '24h' }
        );
        const refreshToken = jwt.sign(
            { userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE },
            JWT_SECRET as string,
            { expiresIn: '30d' }
        );

        res.status(200).json({ user: userWithoutPassword, token, refreshToken });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/login', validateData(loginUserSchema), async (req, res) => {
    try {
        const data = req.cleanBody;
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
        if (!user) {
            res.status(400).json({ message: 'Authentication Failed!' });
        } else {
            const isPasswordValid = await bcrypt.compare(data.password, user.password);
            if (!isPasswordValid) {
                res.status(400).json({ message: 'Authentication Failed!' });
            } else {
                const { password, ...userWithoutPassword } = user;
                const token = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE }, JWT_SECRET as string, { expiresIn: '24h' });
                const refreshToken = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE }, JWT_SECRET as string, { expiresIn: '30d' });
                res.status(200).json({ user: userWithoutPassword, token, refreshToken });
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/forgot-password', validateData(forgotPasswordSchema), async (req, res) => {
    try {
        const { email } = req.cleanBody;
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Generate new password
        const newPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        await db.update(usersTable)
            .set({ password: hashedPassword })
            .where(eq(usersTable.email, email));

        // Send email with new password
        await emailService.sendPasswordReset(email, newPassword);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Error in forgot password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/reset-password', validateData(resetPasswordSchema), async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.cleanBody;
        const userId = req.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Current password is incorrect' });
            return;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.update(usersTable)
            .set({ password: hashedPassword })
            .where(eq(usersTable.id, userId));

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error in reset password:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/verify-email', validateData(verifyEmailSchema), async (req, res) => {
    try {
        const { email, code } = req.cleanBody;
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
        
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        if (user.isEmailVerified) {
            res.status(400).json({ message: 'Email already verified' });
            return;
        }

        if (user.emailVerificationCode !== code) {
            res.status(400).json({ message: 'Invalid verification code' });
            return;
        }

        // Update user as verified
        await db.update(usersTable)
            .set({ 
                isEmailVerified: true,
                emailVerificationCode: null
            })
            .where(eq(usersTable.email, email));

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Error in verify email:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/request-verification', async (req, res) => {
    try {
      const { email } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
        // Generate verification code
      const verificationCode = generateVerificationCode();
  
      // Update user with verification code and expiry time
      await db.update(usersTable)
        .set({
          emailVerificationCode: verificationCode,
        })
        .where(eq(usersTable.email, email));
  
      // Send verification email
      await emailService.sendEmailVerification(email, verificationCode);
  
      res.json({ message: 'Verification email sent' });
    } catch (error) {
      console.error('Error requesting verification:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  });
  

export default router;
