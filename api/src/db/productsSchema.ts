import { integer, pgTable, varchar, timestamp, text, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const productsTable = pgTable("products", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  description: text(),
  price: doublePrecision().notNull(),
  quantity: integer().default(0),
  categoryId: integer().references(() => productCategoriesTable.id),
  image: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  createdBy: integer().notNull(),
  updatedBy: integer().notNull(),
});

export const productCategoriesTable = pgTable("product_categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  parentId: integer().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  createdBy: integer().notNull(),
  updatedBy: integer().notNull(),
});

export const createProductSchema = createInsertSchema(productsTable).omit({
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateProductSchema = createInsertSchema(productsTable)
  .omit({
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .partial();

export const productCategoriesSchema = createInsertSchema(productCategoriesTable).omit({
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
});

export const updateProductCategorySchema = createInsertSchema(productCategoriesTable)
  .omit({
    createdAt: true,
    updatedAt: true,
    createdBy: true,
    updatedBy: true,
  })
  .partial();
  