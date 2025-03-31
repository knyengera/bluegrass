import { Product } from "@/types/Product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface FavoriteState {
    items: Product[];
}

interface FavoriteActions {
    addItem: (item: Product) => void;
    removeItem: (item: Product) => void;
    clearFavorites: () => void;
}
      
export const useFavorite = create<FavoriteState & FavoriteActions>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            removeItem: (item) => set((state) => ({ items: state.items.filter((i) => i.id !== item.id) })),
            clearFavorites: () => set({ items: [] }),
        }),
        {
            name: "favorites",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);




