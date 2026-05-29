import { Boxes, MapPin, PackageCheck, UserRound } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../store";

export function DashboardPage() {
  const { user, cart } = useStore();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="page-shell">
      <section className="mx-auto max-w-7xl px-4 py-10">
        <p className="section-kicker">Dashboard</p>
        <h1 className="section-title">Welcome, {user.name}</h1>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            [UserRound, "Profile", user.email],
            [Boxes, "Cart items", `${cart.length} active products`],
            [PackageCheck, "Orders", "Demo orders appear after checkout"]
          ].map(([Icon, title, text]) => (
            <div className="feature-tile" key={String(title)}>
              <Icon size={25} className="text-emerald-600" />
              <h3>{title as string}</h3>
              <p>{text as string}</p>
            </div>
          ))}
        </div>
        <div className="checkout-band mt-8">
          <div>
            <p className="section-kicker">Next action</p>
            <h2 className="text-3xl font-black">Continue building your tile order</h2>
            <p className="mt-2 text-stone-600">Marketplace, cart, checkout, and AI studio are now separated into their own pages.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="primary-button" to="/marketplace">Marketplace</Link>
            <Link className="secondary-dark-button" to="/ai-studio">
              <MapPin size={18} /> AI Studio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
