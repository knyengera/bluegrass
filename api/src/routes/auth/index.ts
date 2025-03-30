import { Router } from 'express';
import { createUserSchema, loginUserSchema } from '../../db/userSchema';
import { validateData } from '../../middleware/validationMiddleware';
import { db } from "../../db";
import { usersTable } from '../../db/userSchema';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ISSUER = process.env.JWT_ISSUER;
const JWT_AUDIENCE = process.env.JWT_AUDIENCE;


router.post('/register', validateData(createUserSchema), async (req, res) => {
    try {
        const data = req.cleanBody;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
        if (user) {
            res.status(400).json({ message: 'User already exists' });
        } else {
            const [user] = await db.insert(usersTable).values(data).returning();
            const { password, ...userWithoutPassword } = user;
            const token = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE }, JWT_SECRET as string, { expiresIn: '24h' });
            const refreshToken = jwt.sign({ userId: user.id, name: user.name, email: user.email, role: user.role, iss: JWT_ISSUER, aud: JWT_AUDIENCE }, JWT_SECRET as string, { expiresIn: '30d' });
            res.status(200).json({ user: userWithoutPassword, token, refreshToken });
        }
    } catch (error) {
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

router.post('/forgot-password', (req, res) => {
    res.send('forgot-password');
});

router.post('/reset-password', (req, res) => {
    res.send('reset-password');
});

router.post('/verify-email', (req, res) => {
    res.send('verify-email');
}); 

export default router;
