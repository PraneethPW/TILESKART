import axios from "axios";
import type { Address, CartItem, Product, User } from "./types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tileskart-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchProducts = async () => {
  const response = await api.get<Product[]>("/products");
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<{ user: User; token: string }>("/auth/login", { email, password });
  return response.data;
};

export const register = async (name: string, email: string, password: string, phone: string) => {
  const response = await api.post<{ user: User; token: string }>("/auth/register", { name, email, password, phone });
  return response.data;
};

export const createOrder = async (address: Address, cart: CartItem[]) => {
  const response = await api.post("/orders", {
    address,
    items: cart.map((item) => ({ productId: item.product.id, quantitySqFt: item.quantitySqFt }))
  });
  return response.data;
};

export const askDesigner = async (room: string, budget: string, vibe: string) => {
  const response = await api.post<{ advice: string }>("/ai/design-advice", { room, budget, vibe });
  return response.data.advice;
};
