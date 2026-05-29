import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Bill } from "../components/Bill";
import { currency, getCartTotals } from "../lib";
import { useStore } from "../store";

export function CartPage() {
  const { cart, updateQty, removeFromCart, user } = useStore();
  const totals = getCartTotals(cart);

  return (
    <main className="page-shell">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <div>
          <p className="section-kicker">Cart</p>
          <h1 className="section-title">Review your surface order</h1>
          <div className="mt-8 grid gap-4">
            {cart.length === 0 && (
              <div className="empty-state">
                <ShoppingBag size={42} />
                <h2>Your cart is empty</h2>
                <p>Add products from the marketplace to start checkout.</p>
                <Link className="primary-button" to="/marketplace">Explore marketplace</Link>
              </div>
            )}
            {cart.map((item) => (
              <div className="cart-row bg-white" key={item.product.id}>
                <img src={item.product.imageUrl} alt={item.product.name} />
                <div className="min-w-0 flex-1">
                  <Link to={`/product/${item.product.slug}`} className="font-black">{item.product.name}</Link>
                  <p className="text-sm text-stone-500">{currency.format(item.product.pricePerSqFt)} / sq ft</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button className="qty-button" onClick={() => updateQty(item.product.id, Math.max(1, item.quantitySqFt - 10))}>
                      <Minus size={15} />
                    </button>
                    <input className="qty-input" type="number" value={item.quantitySqFt} onChange={(event) => updateQty(item.product.id, Number(event.target.value))} />
                    <button className="qty-button" onClick={() => updateQty(item.product.id, item.quantitySqFt + 10)}>
                      <Plus size={15} />
                    </button>
                    <button className="qty-button ml-auto" onClick={() => removeFromCart(item.product.id)}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside className="summary-panel">
          <h2 className="text-2xl font-black">Order summary</h2>
          <Bill {...totals} />
          <Link className={`primary-button mt-5 w-full ${cart.length === 0 ? "pointer-events-none opacity-40" : ""}`} to={user ? "/checkout" : "/login"}>
            {user ? "Continue to checkout" : "Login to checkout"} <ArrowRight size={18} />
          </Link>
        </aside>
      </section>
    </main>
  );
}
