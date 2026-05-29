import type { CartItem } from "./types";

export const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});

export const getCartTotals = (cart: CartItem[]) => {
  const subtotal = cart.reduce((sum, item) => sum + item.product.pricePerSqFt * item.quantitySqFt, 0);
  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 1499;
  const gst = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + gst;

  return { subtotal, deliveryFee, gst, total };
};
