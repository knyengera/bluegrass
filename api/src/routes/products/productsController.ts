import { RequestHandler } from "express";
import { db } from "../../db/index.js";
import { productCategoriesTable, productsTable } from "../../db/productsSchema.js";
import { eq, like, or, and } from "drizzle-orm";
import _ from "lodash";

type Category = typeof productCategoriesTable.$inferSelect;
type CategoryWithChildren = Category & {
    children: CategoryWithChildren[];
};

export const getAllProducts: RequestHandler = async (req, res) => {
    try {
        const products = await db.select().from(productsTable);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to get products" });
    }
};

export const getProductById: RequestHandler = async (req, res) => {
    try {
        const [product] = await db.select().from(productsTable).where(eq(productsTable.id, parseInt(req.params.id)));
        if (!product) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get product" });
    }
};

export const getProductByName: RequestHandler = async (req, res) => {
    try {
        const products = await db.select().from(productsTable).where(like(productsTable.name, `%${req.params.name}%`));
        if (!products.length) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get product" });
    }
};

export const getProductByCategory: RequestHandler = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        
        // Get the category and all its subcategories
        const categories = await db.select()
            .from(productCategoriesTable)
            .where(or(
                eq(productCategoriesTable.id, categoryId),
                eq(productCategoriesTable.parentId, categoryId)
            ));

        if (!categories.length) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Get all category IDs (main category + subcategories)
        const categoryIds = categories.map(c => c.id);

        // Get products that belong to any of these categories
        const products = await db.select()
            .from(productsTable)
            .where(or(...categoryIds.map(id => eq(productsTable.categoryId, id))));

        if (!products.length) {
            res.status(404).json({ error: "No products found in this category" });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get products" });
    }
};

export const getProductCategories: RequestHandler = async (req, res) => {
    try {
        // Get all categories
        const categories = await db.select().from(productCategoriesTable);
        
        // Build category tree
        const categoryMap = new Map<number, CategoryWithChildren>();
        const rootCategories: CategoryWithChildren[] = [];

        // First pass: create category objects
        categories.forEach(category => {
            categoryMap.set(category.id, { ...category, children: [] });
        });

        // Second pass: build the tree
        categories.forEach(category => {
            const categoryNode = categoryMap.get(category.id);
            if (!categoryNode) return;
            
            if (!category.parentId || category.parentId === 0) {
                rootCategories.push(categoryNode);
            } else {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push(categoryNode);
                }
            }
        });

        res.status(200).json(rootCategories);
    } catch (error) {
        res.status(500).json({ error: "Failed to get product categories" });
    }
};

export const getProductCategoryById: RequestHandler = async (req, res) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        
        // Get the category and all its subcategories
        const categories = await db.select()
            .from(productCategoriesTable)
            .where(or(
                eq(productCategoriesTable.id, categoryId),
                eq(productCategoriesTable.parentId, categoryId)
            ));

        if (!categories.length) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        // Build category tree for this specific category
        const categoryMap = new Map();
        const rootCategory = categories.find(c => c.id === categoryId);
        
        if (!rootCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        categoryMap.set(rootCategory.id, { ...rootCategory, children: [] });
        
        categories.forEach(category => {
            if (category.id !== categoryId) {
                const parent = categoryMap.get(category.parentId);
                if (parent) {
                    parent.children.push({ ...category, children: [] });
                }
            }
        });

        res.status(200).json(categoryMap.get(categoryId));
    } catch (error) {
        res.status(500).json({ error: "Failed to get product category" });
    }
};

export const createProduct: RequestHandler = async (req, res) => {
    try {
        const product = await db.insert(productsTable)
        .values({
            ...req.cleanBody,
            createdAt: new Date(),
            createdBy: req.userId,
        })
        .returning();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

export const updateProduct: RequestHandler = async (req, res) => {
    try {
        const updatedProduct = req.cleanBody;
        const [product] = await db.update(productsTable).set({
            ...updatedProduct,
            updatedAt: new Date(),
            updatedBy: req.userId,
        }).where(eq(productsTable.id, parseInt(req.params.id))).returning();
        if (!product) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(product);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

export const deleteProduct: RequestHandler = async (req, res) => {
    try {
        const [product] = await db.delete(productsTable).where(eq(productsTable.id, parseInt(req.params.id))).returning();
        if (!product) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(204).send();
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};

export const createProductCategory: RequestHandler = async (req, res) => {
    try {
        const { name, parentId = 0 } = req.body;
        const userId = req.userId;

        if (!name) {
            res.status(400).json({ error: "Category name is required" });
            return;
        }

        // If parentId is provided, verify it exists
        if (parentId !== 0) {
            const parentCategory = await db
                .select()
                .from(productCategoriesTable)
                .where(eq(productCategoriesTable.id, parentId))
                .limit(1);

            if (parentCategory.length === 0) {
                res.status(404).json({ error: "Parent category not found" });
                return;
            }
        }

        const [newCategory] = await db
            .insert(productCategoriesTable)
            .values({
                name,
                parentId,
                createdBy: Number(userId),
                updatedBy: Number(userId)
            })
            .returning();

        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating product category:', error);
        res.status(500).json({ error: "Failed to create product category" });
    }
};
