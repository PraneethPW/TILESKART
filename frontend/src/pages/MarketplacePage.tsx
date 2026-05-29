import { BadgeCheck, Layers3, Search, ShieldCheck, Truck } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

export function MarketplacePage() {
  const { products, categories, loading } = useProducts();
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesCategory = category === "All" || product.category === category;
        const text = `${product.name} ${product.category} ${product.material} ${product.origin}`.toLowerCase();
        return matchesCategory && text.includes(search.toLowerCase());
      }),
    [category, products, search]
  );

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="market-head">
          <div>
            <p className="section-kicker">Marketplace</p>
            <h1 className="section-title">Tiles, marble, stone, and statement surfaces</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              Curated options for homes, cafes, offices, parking areas, balconies, bathrooms, and premium villas.
            </p>
          </div>
          <div className="search-box">
            <Search size={18} />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search marble, parking, Kota..." />
          </div>
        </div>
        <div className="market-service-strip">
          {[
            [Layers3, `${products.length}+`, "surface options"],
            [BadgeCheck, "GST", "ready pricing"],
            [Truck, "India", "delivery planning"],
            [ShieldCheck, "Demo", "safe checkout"]
          ].map(([Icon, value, label]) => (
            <div className="market-service-item" key={label as string}>
              <Icon size={20} />
              <div>
                <b>{value as string}</b>
                <span>{label as string}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="filter-row">
          {categories.map((item) => (
            <button key={item} className={`filter-chip ${category === item ? "active" : ""}`} onClick={() => setCategory(item)}>
              {item}
            </button>
          ))}
        </div>
        {loading && <p className="rounded bg-white p-4 font-semibold text-stone-600">Loading live catalog...</p>}
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            <Search size={42} />
            <h2>No surfaces found</h2>
            <p>Try a different category, material, city, finish, or room style.</p>
          </div>
        )}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </section>
    </main>
  );
}
