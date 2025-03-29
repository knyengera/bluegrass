import { Request, Response } from "express";

export function getAllProducts (req: Request, res: Response) {
    res.send("The List of Products");
};

export function getProductById (req: Request, res: Response) {
    res.send(`Product ID is ${req.params.id}`);
};

export function createProduct (req: Request, res: Response) {
    res.send("Creating a new product");
};  

export function updateProduct (req: Request, res: Response) {
    res.send(`Updating product ${req.params.id}`);
};

export function deleteProduct (req: Request, res: Response) {
    res.send(`Deleting product ${req.params.id}`);
};
