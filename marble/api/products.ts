const API_URL = process.env.EXPO_PUBLIC_API_URL;

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











