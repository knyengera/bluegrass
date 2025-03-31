import { Product } from "@/types/Product";
import { create } from "zustand";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartState {
    items: CartItem[];
}

interface CartActions {
    addProduct: (product: Product) => void;
    removeProduct: (product: Product) => void;
    increaseQuantity: (product: Product) => void;
    decreaseQuantity: (product: Product) => void;
    clearCart: () => void;
}           

export const useCart = create<CartState & CartActions>((set) => ({
    items: [],
    addProduct: (product) => set((state) => {
        const existingItem = state.items.find(item => item.product.id === product.id);
        if (existingItem) {
            return {
                items: state.items.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }
        return { items: [...state.items, { product, quantity: 1 }] };
    }),
    removeProduct: (product) => set((state) => ({ 
        items: state.items.filter((i) => i.product.id !== product.id) 
    })),
    increaseQuantity: (product) => set((state) => ({ 
        items: state.items.map((i) => 
            i.product.id === product.id 
                ? { ...i, quantity: i.quantity + 1 } 
                : i
        ) 
    })),
    decreaseQuantity: (product) => set((state) => ({ 
        items: state.items.map((i) => 
            i.product.id === product.id 
                ? { ...i, quantity: Math.max(1, i.quantity - 1) }
                : i
        ) 
    })),
    clearCart: () => set({ items: [] }),
}));
