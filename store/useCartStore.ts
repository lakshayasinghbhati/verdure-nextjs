"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  unit: string;
  emoji: string;
  qty: number;
};

type CartState = {
  items: Record<string, CartItem>;
  bump: boolean;
  add: (item: Omit<CartItem, "qty">) => void;
  inc: (productId: string) => void;
  dec: (productId: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: {},
      bump: false,
      add: (item) =>
        set((state) => {
          const existing = state.items[item.productId];
          triggerBump(set);
          return {
            items: {
              ...state.items,
              [item.productId]: { ...item, qty: (existing?.qty || 0) + 1 },
            },
          };
        }),
      inc: (productId) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;
          triggerBump(set);
          return { items: { ...state.items, [productId]: { ...existing, qty: existing.qty + 1 } } };
        }),
      dec: (productId) =>
        set((state) => {
          const existing = state.items[productId];
          if (!existing) return state;
          const next = { ...state.items };
          if (existing.qty <= 1) delete next[productId];
          else next[productId] = { ...existing, qty: existing.qty - 1 };
          return { items: next };
        }),
      clear: () => set({ items: {} }),
      count: () => Object.values(get().items).reduce((s, i) => s + i.qty, 0),
      subtotal: () => Object.values(get().items).reduce((s, i) => s + i.qty * i.price, 0),
    }),
    { name: "verdure-cart" }
  )
);

// Briefly flips `bump` true so the nav basket icon can play its animation,
// then resets it — this is the hook the BasketIcon component reads.
function triggerBump(set: (fn: (state: CartState) => Partial<CartState>) => void) {
  set(() => ({ bump: true }));
  setTimeout(() => set(() => ({ bump: false })), 420);
}
