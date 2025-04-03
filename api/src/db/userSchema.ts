import { pgTable, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    mobile: varchar('mobile', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull().default('user'),
    isActive: boolean('is_active').notNull().default(true),
    isEmailVerified: boolean('is_email_verified').notNull().default(false),
    emailVerificationCode: varchar('email_verification_code', { length: 255 }),
    address1: varchar('address1', { length: 255 }),
    address2: varchar('address2', { length: 255 }),
    city: varchar('city', { length: 255 }),
    province: varchar('province', { length: 255 }),
    postalCode: varchar('postal_code', { length: 255 }),
    country: varchar('country', { length: 255 }),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

const baseSchema = createInsertSchema(usersTable);

export const createUserSchema = baseSchema
    .omit({
        createdAt: true,
        updatedAt: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        emailVerificationCode: true,
    })
    .extend({
        name: z.string().min(1, "Name cannot be empty"),
        email: z.string().email("Invalid email format").min(1, "Email cannot be empty"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        mobile: z.string().min(1, "Mobile number cannot be empty"),
    });

export const updateUserSchema = baseSchema
    .omit({
        createdAt: true,
        role: true,
        isActive: true,
        isEmailVerified: true,
        emailVerificationCode: true,
    })
    .extend({
        name: z.string().min(1, "Name cannot be empty").optional(),
        email: z.string().email("Invalid email format").min(1, "Email cannot be empty").optional(),
        password: z.string().min(6, "Password must be at least 6 characters").optional(),
        mobile: z.string().min(1, "Mobile number cannot be empty").optional(),
    });

export const loginUserSchema = baseSchema
    .pick({
        email: true,
        password: true,
    })
    .extend({
        email: z.string().email("Invalid email format").min(1, "Email cannot be empty"),
        password: z.string().min(1, "Password cannot be empty"),
    });

export const forgotPasswordSchema = baseSchema
    .pick({
        email: true,
    })
    .extend({
        email: z.string().email("Invalid email format").min(1, "Email cannot be empty"),
    });

export const resetPasswordSchema = baseSchema
    .pick({
        password: true,
    })
    .extend({
        password: z.string().min(6, "Password must be at least 6 characters"),
    });

export const verifyEmailSchema = baseSchema
    .pick({
        email: true,
    })
    .extend({
        email: z.string().email("Invalid email format").min(1, "Email cannot be empty"),
    });
