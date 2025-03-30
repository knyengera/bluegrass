import { pgTable, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    mobile: varchar('mobile', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull().default('user'),
    isActive: boolean('is_active').notNull().default(true),
    address1: varchar('address1', { length: 255 }),
    address2: varchar('address2', { length: 255 }),
    city: varchar('city', { length: 255 }),
    province: varchar('province', { length: 255 }),
    postalCode: varchar('postal_code', { length: 255 }),
    country: varchar('country', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
    createdAt: true,
    updatedAt: true,
    role: true,
    isActive: true,
});

export const updateUserSchema = createInsertSchema(usersTable).omit({
    createdAt: true,
    role: true,
    isActive: true,
});

export const loginUserSchema = createInsertSchema(usersTable).pick({
    email: true,
    password: true,
});

export const forgotPasswordSchema = createInsertSchema(usersTable).pick({
    email: true,
});

export const resetPasswordSchema = createInsertSchema(usersTable).pick({
    password: true,
});

export const verifyEmailSchema = createInsertSchema(usersTable).pick({
    email: true,
});
