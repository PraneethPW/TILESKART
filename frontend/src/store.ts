import { create } from "zustand";
import type { CartItem, Product, User } from "./types";

type Store = {
  user: User | null;
  cart: CartItem[];
  setUser: (user: User | null, token?: string) => void;
  addToCart: (product: Product, quantitySqFt?: number) => void;
  updateQty: (productId: string, quantitySqFt: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

const savedUser = localStorage.getItem("tileskart-user");
const savedCart = localStorage.getItem("tileskart-cart");
const readSavedCart = () => {
  try {
    return savedCart ? (JSON.parse(savedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const persistCart = (cart: CartItem[]) => {
  localStorage.setItem("tileskart-cart", JSON.stringify(cart));
  return cart;
};

export const useStore = create<Store>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  cart: readSavedCart(),
  setUser: (user, token) => {
    if (user) {
      localStorage.setItem("tileskart-user", JSON.stringify(user));
      if (token) localStorage.setItem("tileskart-token", token);
    } else {
      localStorage.removeItem("tileskart-user");
      localStorage.removeItem("tileskart-token");
    }
    set({ user });
  },
  addToCart: (product, quantitySqFt = 50) =>
    set((state) => {
      const existing = state.cart.find((item) => item.product.id === product.id);
      if (existing) {
        const cart = state.cart.map((item) =>
          item.product.id === product.id ? { ...item, quantitySqFt: item.quantitySqFt + quantitySqFt } : item
        );
        return {
          cart: persistCart(cart)
        };
      }
      return { cart: persistCart([...state.cart, { product, quantitySqFt }]) };
    }),
  updateQty: (productId, quantitySqFt) =>
    set((state) => {
      const cart = state.cart.map((item) => (item.product.id === productId ? { ...item, quantitySqFt } : item));
      return { cart: persistCart(cart) };
    }),
  removeFromCart: (productId) =>
    set((state) => ({ cart: persistCart(state.cart.filter((item) => item.product.id !== productId)) })),
  clearCart: () => {
    localStorage.removeItem("tileskart-cart");
    set({ cart: [] });
  }
}));
