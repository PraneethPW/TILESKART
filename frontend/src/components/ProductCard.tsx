import { Heart, IndianRupee, Plus, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { currency } from "../lib";
import { useStore } from "../store";
import type { Product } from "../types";

export function ProductCard({ product }: { product: Product }) {
  const addToCart = useStore((state) => state.addToCart);

  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-image-wrap block">
        <img src={product.imageUrl} alt={product.name} className="product-image" />
        <button className="heart-button" aria-label="Wishlist" type="button">
          <Heart size={18} />
        </button>
        {product.isFeatured && <span className="featured-badge">Featured</span>}
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-emerald-700">{product.category}</p>
          <span className="flex items-center gap-1 text-sm font-black">
            <Star size={15} className="fill-amber-400 text-amber-400" /> {product.rating}
          </span>
        </div>
        <Link to={`/product/${product.slug}`}>
          <h3 className="mt-2 text-2xl font-black leading-tight">{product.name}</h3>
        </Link>
        <p className="mt-3 min-h-14 text-sm leading-6 text-stone-600">{product.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold text-stone-600">
          <span className="rounded bg-stone-100 p-2">{product.finish}</span>
          <span className="rounded bg-stone-100 p-2">{product.size}</span>
          <span className="rounded bg-stone-100 p-2">{product.material}</span>
          <span className="rounded bg-stone-100 p-2">{product.origin}</span>
        </div>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="flex items-center text-2xl font-black">
              <IndianRupee size={21} /> {product.pricePerSqFt}
              <span className="ml-1 text-sm text-stone-500">/ sq ft</span>
            </p>
            <p className="text-sm text-stone-400 line-through">{currency.format(product.mrpPerSqFt)} / sq ft</p>
          </div>
          <button className="add-button" onClick={() => addToCart(product, 50)}>
            <Plus size={18} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
