import { Request, Response } from "express";
import { RequestHandler } from "express";
import { db } from "../../db/index.js";
import { ordersTable, orderItemsTable } from "../../db/ordersSchema.js";
import { productsTable } from "../../db/productsSchema.js";
import { usersTable } from "../../db/userSchema.js";
import { eq, inArray } from "drizzle-orm";
import { EmailService } from "../../services/email.service.js";

const emailService = new EmailService();

export const getAllOrders: RequestHandler = async (req, res) => {
    try {
        const ordersWithItems = await db
            .select()
            .from(ordersTable)
            .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

        const mergedOrders = ordersWithItems.reduce((acc, curr) => {
            const orderId = curr.orders.id;
            if (!acc[orderId]) {
                acc[orderId] = {
                    ...curr.orders,
                    items: [],
                };
            }
            if (curr.order_items) {
                acc[orderId].items.push(curr.order_items);
            }
            return acc;
        }, {} as Record<number, any>);

        res.status(200).json(Object.values(mergedOrders));
    } catch (error) {
        res.status(500).json({ error: "Failed to get orders" });
    }
};

export const getOrderByUserId: RequestHandler = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const ordersWithItems = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.userId, Number(userId)))
            .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

        const mergedOrders = ordersWithItems.reduce((acc, curr) => {
            const orderId = curr.orders.id;
            if (!acc[orderId]) {
                acc[orderId] = {
                    ...curr.orders,
                    items: [],
                };
            }
            if (curr.order_items) {
                acc[orderId].items.push(curr.order_items);
            }
            return acc;
        }, {} as Record<number, any>);

        res.status(200).json(Object.values(mergedOrders));
    } catch (error) {
        res.status(500).json({ error: "Failed to get orders" });
    }
};

export const getOrderById: RequestHandler = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(401).json({ error: "Order ID is required" });
            return;
        }

        const orderWithItems = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.id, Number(orderId)))
            .leftJoin(orderItemsTable, eq(ordersTable.id, orderItemsTable.orderId));

        if (orderWithItems.length === 0) {
            res.status(404).json({ error: "Order not found" });
            return;
        }

        const mergedOrder = {
            ...orderWithItems[0].orders,
            items: orderWithItems.map((oi) => oi.order_items),
        };

        res.status(200).json(mergedOrder);
    } catch (error) {
        res.status(500).json({ error: "Failed to get order" });
    }
};

export const createOrder: RequestHandler = async (req, res) => {
    try {
        const { items, ...orderData } = req.body;
        const userId = req.userId;
        
        if (!userId) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ error: "Order must contain at least one item" });
            return;
        }

        const productIds = items.map(item => item.productId);
        
        const products = await db
            .select({ 
                id: productsTable.id, 
                price: productsTable.price,
                quantity: productsTable.quantity,
                name: productsTable.name
            })
            .from(productsTable)
            .where(inArray(productsTable.id, productIds));

        const productPrices = new Map(products.map(p => [p.id, p.price]));
        const productQuantities = new Map(products.map(p => [p.id, p.quantity ?? 0]));
        const productNames = new Map(products.map(p => [p.id, p.name]));

        const availableItems = [];
        const unavailableItems = [];

        for (const item of items) {
            const quantity = productQuantities.get(item.productId);
            if (quantity === undefined) {
                unavailableItems.push({
                    productId: item.productId,
                    name: 'Unknown Product',
                    requested: item.quantity,
                    available: 0,
                    reason: 'Product not found'
                });
                continue;
            }

            if (quantity >= item.quantity) {
                availableItems.push(item);
            } else {
                unavailableItems.push({
                    productId: item.productId,
                    name: productNames.get(item.productId)!,
                    requested: item.quantity,
                    available: quantity,
                    reason: 'Insufficient quantity'
                });
            }
        }

        if (availableItems.length === 0) {
            res.status(400).json({ 
                error: "No items available to order",
                unavailableItems 
            });
            return;
        }

        const totalPrice = availableItems.reduce((sum, item) => {
            const price = productPrices.get(item.productId);
            if (!price) {
                throw new Error(`Product with ID ${item.productId} not found`);
            }
            return sum + (price * item.quantity);
        }, 0);

        const [newOrder] = await db
            .insert(ordersTable)
            .values({
                ...orderData,
                totalPrice,
                status: 'pending',
                userId: Number(userId),
                createdBy: Number(userId),
                updatedBy: Number(userId)
            })
            .returning();

        const orderItems = await db
            .insert(orderItemsTable)
            .values(
                availableItems.map(item => ({
                    orderId: newOrder.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price: productPrices.get(item.productId)!,
                    createdBy: Number(userId),
                    updatedBy: Number(userId)
                }))
            )
            .returning();

        // Get user email for notification
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, Number(userId))
        });

        if (user) {
            // Get all admin emails
            const adminUsers = await db.query.usersTable.findMany({
                where: eq(usersTable.role, 'admin'),
                columns: {
                    email: true
                }
            });

            const adminEmails = adminUsers.map(admin => admin.email);

            // Send new order notification to client and all admins
            await emailService.sendNewOrderNotification(
                newOrder.id.toString(),
                user.email,
                adminEmails,
                availableItems.map(item => ({
                    name: productNames.get(item.productId)!,
                    quantity: item.quantity,
                    price: productPrices.get(item.productId)!
                })),
                {
                    address1: user.address1,
                    address2: user.address2,
                    city: user.city,
                    province: user.province,
                    postalCode: user.postalCode,
                    country: user.country
                }
            );

            // Check for low stock products
            const lowStockProducts = [];
            for (const item of availableItems) {
                const product = await db.query.productsTable.findFirst({
                    where: eq(productsTable.id, item.productId)
                });

                if (product && (product.quantity ?? 0) < 100) {
                    lowStockProducts.push({
                        name: product.name,
                        currentStock: product.quantity ?? 0
                    });
                }
            }

            // Send low stock notification to all admins if needed
            if (lowStockProducts.length > 0) {
                await emailService.sendLowStockNotification(
                    adminEmails,
                    lowStockProducts
                );
            }
        }

        // Update product quantities
        for (const item of availableItems) {
            const currentQuantity = productQuantities.get(item.productId)!;
            await db
                .update(productsTable)
                .set({ 
                    quantity: currentQuantity - item.quantity,
                    updatedBy: Number(userId)
                })
                .where(eq(productsTable.id, item.productId));
        }

        res.status(201).json({
            ...newOrder,
            items: orderItems,
            unavailableItems: unavailableItems.length > 0 ? unavailableItems : undefined
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: "Failed to create order" });
    }
};

export const updateOrder: RequestHandler = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(400).json({ error: "Order ID is required" });
            return;
        }

        const [updatedOrder] = await db
            .update(ordersTable)
            .set(req.body)
            .where(eq(ordersTable.id, Number(orderId)))
            .returning();

        if (!updatedOrder) {
            res.status(404).json({ error: "Order not found" });
            return;
        }

        // Get user email for notification
        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.id, updatedOrder.userId)
        });

        if (user && req.body.status) {
            // Get all admin emails
            const adminUsers = await db.query.usersTable.findMany({
                where: eq(usersTable.role, 'admin'),
                columns: {
                    email: true
                }
            });

            const adminEmails = adminUsers.map(admin => admin.email);

            // Send status update notification to all recipients
            await emailService.sendOrderStatusUpdate(
                orderId,
                [user.email, ...adminEmails],
                req.body.status
            );
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ error: "Failed to update order" });
    }
};

export const deleteOrder: RequestHandler = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(401).json({ error: "Order ID is required" });
            return;
        }
        await db.delete(ordersTable).where(eq(ordersTable.id, Number(orderId)));
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to delete order" });
    }
};