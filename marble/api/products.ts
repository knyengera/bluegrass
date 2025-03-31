const API_URL = process.env.EXPO_PUBLIC_API_URL;
import { Order } from "@/types/Order";


export async function getProducts() {
    const response = await fetch(`${API_URL}/products`);
    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }
    const data = await response.json();
    return data;
}

export async function getProductById(id: string) {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }
    const data = await response.json();
    return data;
}

export async function getProductCategories() {
    const response = await fetch(`${API_URL}/products/categories`);
    if (!response.ok) {
        throw new Error("Failed to fetch product categories");
    }
    const data = await response.json();
    return data;
}

export async function getProductCategoryById(id: string) {
    const response = await fetch(`${API_URL}/products/categories/${id}`);
    if (!response.ok) {
        throw new Error("Failed to fetch product category");
    }
    const data = await response.json();
    return data;
}

export async function createOrder(order: Order, token: string) {
    console.log("order", order);
    console.log("token", token);
    const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${token}`,
        },
        body: JSON.stringify(order),
    });
    if (!response.ok) {
        throw new Error("Failed to create order");
    }
    const data = await response.json();
}












