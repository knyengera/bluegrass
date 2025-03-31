import { Product } from "./Product";

export interface Order {
    items: {
        product: Product;
        quantity: number;
    }[];
    subtotal: number;
    deliveryFee: number;
    total: number;
} 