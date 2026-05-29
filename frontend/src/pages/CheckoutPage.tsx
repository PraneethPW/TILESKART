import { AlertCircle, CreditCard, Loader2, PackageCheck } from "lucide-react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { createOrder } from "../api";
import { Bill } from "../components/Bill";
import { getCartTotals } from "../lib";
import { useStore } from "../store";
import type { Address } from "../types";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, user, clearCart } = useStore();
  const totals = getCartTotals(cart);
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState<Address>({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    label: "Home"
  });

  if (!user) return <Navigate to="/login" replace />;
  if (cart.length === 0 && !isPlacing) return <Navigate to="/cart" replace />;

  const handleCheckout = async () => {
    setError("");
    const requiredFields: Array<keyof Address> = ["fullName", "phone", "line1", "city", "state", "pincode"];
    const hasMissingFields = requiredFields.some((field) => !String(address[field] ?? "").trim());
    if (hasMissingFields) {
      setError("Please fill the delivery details before placing the demo order.");
      return;
    }

    setIsPlacing(true);
    let orderId = "";
    try {
      const order = await createOrder(address, cart);
      orderId = order.id;
    } catch {
      orderId = `TK-DEMO-${Date.now().toString().slice(-6)}`;
    }
    clearCart();
    navigate(`/order-success?order=${orderId}`, {
      replace: true,
      state: { orderId, customerName: address.fullName, total: totals.total }
    });
  };

  return (
    <main className="page-shell">
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_420px]">
        <div className="modal-card">
          <p className="section-kicker">Checkout</p>
          <h1 className="mt-2 text-4xl font-black">Delivery address</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {(["fullName", "phone", "line1", "line2", "city", "state", "pincode", "label"] as const).map((field) => (
              <input
                key={field}
                className={`field ${field === "line1" ? "sm:col-span-2" : ""}`}
                placeholder={field}
                value={address[field] ?? ""}
                onChange={(event) => setAddress({ ...address, [field]: event.target.value })}
              />
            ))}
          </div>
          {error && (
            <p className="mt-4 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              <AlertCircle size={17} /> {error}
            </p>
          )}
          <div className="mt-5 rounded border border-emerald-200 bg-emerald-50 p-4">
            <p className="flex items-center gap-2 font-black text-emerald-800">
              <CreditCard size={18} />  payment selected
            </p>
            <p className="mt-1 text-sm text-emerald-700">No Stripe, Razorpay, or card charge. The order is marked as paid .</p>
          </div>
        </div>
        <aside className="summary-panel">
          <h2 className="text-2xl font-black">Payment summary</h2>
          <Bill {...totals} />
          <button className="primary-button mt-5 w-full" onClick={handleCheckout} disabled={isPlacing}>
            {isPlacing ? (
              <>
                Placing order <Loader2 className="animate-spin" size={18} />
              </>
            ) : (
              <>
                Place demo order <PackageCheck size={18} />
              </>
            )}
          </button>
        </aside>
      </section>
    </main>
  );
}
