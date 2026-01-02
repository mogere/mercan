import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartItem, CartState } from "@/types/cart";

interface CartStateWithSync extends CartState {
  syncToDatabase: () => Promise<void>;
  loadFromDatabase: () => Promise<void>;
}

export const useCartStore = create<CartStateWithSync>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.productId === product.productId
        );

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === product.productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          const newItem: CartItem = {
            id: `${product.productId}`,
            ...product,
            quantity: 1,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item.productId !== productId),
        });
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set({
          items: get().items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      syncToDatabase: async () => {
        const items = get().items;

        if (items.length === 0) return;

        try {
          const response = await fetch("/api/cart/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            }),
          });

          if (response.ok) {
            console.log("Cart synced to database successfully");
          }
        } catch (error) {
          console.error("Failed to sync cart to database:", error);
        }
      },

      loadFromDatabase: async () => {
        try {
          const response = await fetch("/api/cart");

          if (!response.ok) {
            console.error("Failed to load cart from database");
            return;
          }

          const cartItems = await response.json();

          // Transform database cart items to match CartItem interface
          const items: CartItem[] = cartItems.map((item: any) => ({
            id: `${item.productId}`,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            inStock: item.inStock,
          }));

          set({ items });
        } catch (error) {
          console.error("Failed to load cart from database:", error);
        }
      },
    }),
    {
      name: "cart-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
