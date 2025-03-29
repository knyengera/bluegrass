import { integer, pgTable, varchar, timestamp, text, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
  mainCategory: varchar({ length: 255 }).notNull(),
  subCategory: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  createdAt: true,
  updatedAt: true
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    createdAt: true,
  })
  .partial();
