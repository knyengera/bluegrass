import { Request, Response } from "express";

export function getAllOrders (req: Request, res: Response) {
    res.send("The List of Orders");
};

export function getOrderById (req: Request, res: Response) {
    res.send(`Order ID is ${req.params.id}`);
};

export function createOrder (req: Request, res: Response) {
    res.send("Creating a new order");
};  

export function updateOrder (req: Request, res: Response) {
    res.send(`Updating order ${req.params.id}`);
};

export function deleteOrder (req: Request, res: Response) {
    res.send(`Deleting order ${req.params.id}`);
};
