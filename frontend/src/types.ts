export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  finish: string;
  size: string;
  origin: string;
  imageUrl: string;
  pricePerSqFt: number;
  mrpPerSqFt: number;
  rating: number;
  stockSqFt: number;
  isFeatured: boolean;
  tags: string[];
  description: string;
};

export type CartItem = {
  product: Product;
  quantitySqFt: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type Address = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  label: string;
};
