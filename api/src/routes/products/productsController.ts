import { Request, Response } from "express";
import { db } from "../../db";
import { productsTable } from "../../db/productsSchema";
import { eq, like } from "drizzle-orm";
import _ from "lodash";
import { createProductSchema } from "../../db/productsSchema";

export async function getAllProducts (req: Request, res: Response) {
    try {
        const products = await db.select().from(productsTable);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to get products" });
    }
};

export async function getProductById (req: Request, res: Response) {
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

export async function getProductByName (req: Request, res: Response) {
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

export async function getProductByCategory (req: Request, res: Response) {
    try {
        const products = await db.select().from(productsTable).where(like(productsTable.mainCategory, `%${req.params.category}%`));
        if (!products.length) {
            res.status(404).json({ error: "Product not found" });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to get product" });
    }
};

export async function createProduct (req: Request, res: Response) {
    try {
        const product = await db.insert(productsTable)
        .values(req.cleanBody)
        .returning();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

export async function updateProduct (req: Request, res: Response) {
    try {
        const updatedProduct = req.cleanBody;
        const [product] = await db.update(productsTable).set({
            ...updatedProduct,
            updatedAt: new Date(),
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

export async function deleteProduct (req: Request, res: Response) {
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
