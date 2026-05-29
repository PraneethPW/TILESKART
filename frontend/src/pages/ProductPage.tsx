import { ArrowLeft, IndianRupee, PackageCheck, Plus, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { currency } from "../lib";
import { useStore } from "../store";

export function ProductPage() {
  const { slug } = useParams();
  const { products } = useProducts();
  const addToCart = useStore((state) => state.addToCart);
  const product = products.find((item) => item.slug === slug);

  if (!product) {
    return (
      <main className="page-shell">
        <section className="mx-auto max-w-4xl px-4 py-16">
          <Link to="/marketplace" className="font-black text-emerald-700">Back to marketplace</Link>
          <h1 className="mt-6 text-4xl font-black">Product not found</h1>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <Link to="/marketplace" className="mb-4 inline-flex items-center gap-2 font-black text-emerald-700">
            <ArrowLeft size={18} /> Marketplace
          </Link>
          <div className="overflow-hidden rounded bg-stone-200">
            <img src={product.imageUrl} alt={product.name} className="h-full min-h-[420px] w-full object-cover" />
          </div>
        </div>
        <div className="product-detail-panel">
          <p className="section-kicker">{product.category}</p>
          <h1 className="mt-3 text-5xl font-black leading-none">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span className="filter-chip" key={tag}>{tag}</span>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex items-center gap-1 rounded bg-amber-100 px-3 py-2 font-black text-amber-700">
              <Star size={17} className="fill-amber-500" /> {product.rating}
            </span>
            <span className="rounded bg-emerald-100 px-3 py-2 font-black text-emerald-800">{product.stockSqFt.toLocaleString("en-IN")} sq ft in stock</span>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              ["Material", product.material],
              ["Finish", product.finish],
              ["Size", product.size],
              ["Origin", product.origin]
            ].map(([label, value]) => (
              <div className="feature-tile" key={label}>
                <p className="text-sm font-black text-stone-500">{label}</p>
                <h3>{value}</h3>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-stone-200 pt-6">
            <div>
              <p className="flex items-center text-4xl font-black">
                <IndianRupee size={32} /> {product.pricePerSqFt}
                <span className="ml-2 text-base text-stone-500">/ sq ft</span>
              </p>
              <p className="text-stone-400 line-through">{currency.format(product.mrpPerSqFt)} / sq ft</p>
            </div>
            <button className="primary-button" onClick={() => addToCart(product, 50)}>
              <Plus size={18} /> Add 50 sq ft
            </button>
          </div>
          <Link to="/cart" className="secondary-dark-button mt-4 w-full">
            <PackageCheck size={18} /> Go to cart
          </Link>
        </div>
      </section>
    </main>
  );
}
