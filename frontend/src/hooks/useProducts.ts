import { useEffect, useMemo, useState } from "react";
import { fetchProducts } from "../api";
import { products as fallbackProducts } from "../data";
import type { Product } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(fallbackProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(products.map((product) => product.category)))], [products]);

  return { products, categories, loading };
}
