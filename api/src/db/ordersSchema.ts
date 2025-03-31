import { integer, pgTable, varchar, timestamp, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { productsTable } from "./productsSchema";
import { usersTable } from "./userSchema";
import { z } from "zod";

export const ordersTable = pgTable("orders", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer().references(() => usersTable.id).notNull(),
  totalPrice: doublePrecision().notNull(),
  status: varchar({ length: 255 }).notNull(),
  paymentIntentId: varchar({ length: 255 }),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  updatedBy: integer().references(() => usersTable.id).notNull(),
  createdBy: integer().references(() => usersTable.id).notNull(),
});

export const orderItemsTable = pgTable("order_items", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().references(() => ordersTable.id).notNull(),
  productId: integer().references(() => productsTable.id).notNull(),
  quantity: integer().notNull(),
  price: doublePrecision().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  updatedBy: integer().references(() => usersTable.id).notNull(),
  createdBy: integer().references(() => usersTable.id).notNull(),
});

export const createOrderSchema = createInsertSchema(ordersTable).omit({
  updatedAt: true,
  updatedBy: true,
  createdAt: true,
  createdBy: true,
  userId: true,
  status: true,
  totalPrice: true,
});

export const updateOrderSchema = createInsertSchema(ordersTable).partial().omit({
  createdAt: true,
  createdBy: true,
  userId: true,
  status: true,
  totalPrice: true,
});

export const createOrderItemSchema = createInsertSchema(orderItemsTable).omit({
  updatedAt: true,
  updatedBy: true,
  orderId: true,
  createdAt: true,
  createdBy: true,
});

export const insertOrderWithItemsSchema = z.object({
    order: createOrderSchema,
    items: z.array(createOrderItemSchema),
});



