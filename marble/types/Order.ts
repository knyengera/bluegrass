import { Product } from "./Product";

export interface Order {
    order: {
        totalPrice: number;
        status: string;
    };
    items: {
        productId: number;
        quantity: number;
        price: number;
    }[];
} 