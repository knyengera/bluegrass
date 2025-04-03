import { Router, Request, Response } from 'express';
import { isAdmin } from '../../middleware/adminMiddleware.js';
import { authenticateUser } from '../../middleware/authMiddleware.js';
import { validateData } from '../../middleware/validationMiddleware.js';
import { db } from "../../db/index.js";
import { usersTable } from '../../db/userSchema.js';
import { ordersTable, orderItemsTable } from '../../db/ordersSchema.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { createUserSchema, updateUserSchema } from '../../db/userSchema.js';

const router = Router();

// Get all users (admin only)
router.get('/', isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await db.select().from(usersTable);
        const usersWithoutPasswords = users.map(({ password, ...user }) => user);
        res.status(200).json(usersWithoutPasswords);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get user by ID (authenticated user or admin)
router.get('/:id', authenticateUser, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const requestingUser = req.user;

        // Check if user exists
        const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // If not admin, can only view their own profile
        if (requestingUser?.role !== 'admin' && requestingUser?.userId !== userId) {
            res.status(403).json({ message: 'You can only view your own profile' });
            return;
        }

        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create user (admin only)
router.post('/', isAdmin, validateData(createUserSchema), async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.cleanBody;
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
        
        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        const [user] = await db.insert(usersTable).values(data).returning();
        const { password, ...userWithoutPassword } = user;
        res.status(201).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update user (authenticated user or admin)
router.put('/:id', authenticateUser, validateData(updateUserSchema), async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        const data = req.cleanBody;
        const requestingUser = req.user;

        // Check if user exists
        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // If not admin, can only update their own profile and cannot change role
        if (requestingUser?.role !== 'admin') {
            if (requestingUser?.userId !== userId) {
                res.status(403).json({ message: 'You can only update your own profile' });
                return;
            }
            // Remove role from update data if not admin
            delete data.role;
        }

        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }

        const [updatedUser] = await db.update(usersTable)
            .set(data)
            .where(eq(usersTable.id, userId))
            .returning();

        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete user (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        
        // Check if user exists
        const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
        if (!existingUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Start a transaction to ensure all deletions succeed or none do
        await db.transaction(async (tx) => {
            // First, delete all order items associated with the user's orders
            const userOrders = await tx.select().from(ordersTable).where(eq(ordersTable.userId, userId));
            for (const order of userOrders) {
                await tx.delete(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
            }

            // Then delete all orders associated with the user
            await tx.delete(ordersTable).where(eq(ordersTable.userId, userId));

            // Finally delete the user
            await tx.delete(usersTable).where(eq(usersTable.id, userId));
        });

        res.status(200).json({ message: 'User and associated data deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router; 