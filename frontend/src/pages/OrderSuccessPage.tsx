import { ArrowRight, Home, PackageCheck, ReceiptText, Truck } from "lucide-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { currency } from "../lib";

export function OrderSuccessPage() {
  const [params] = useSearchParams();
  const location = useLocation();
  const orderId = params.get("order") ?? "TK-DEMO";
  const state = location.state as { customerName?: string; total?: number } | null;

  return (
    <main className="page-shell">
      <section className="success-wrap mx-auto max-w-5xl px-4 py-16">
        <div className="success-panel text-center">
          <div className="mx-auto grid size-20 place-items-center rounded bg-emerald-500 text-white">
            <PackageCheck size={42} />
          </div>
          <p className="section-kicker mt-6">Order placed successfully</p>
          <h1 className="mt-2 text-5xl font-black">Your demo order is confirmed</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg leading-8 text-stone-600">
            {state?.customerName ? `${state.customerName}, your` : "Your"} TilesKart order has been saved with demo payment.
            Our team would now prepare the surface plan, stock check, and delivery coordination.
          </p>
          <div className="mx-auto mt-7 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="success-step">
              <ReceiptText size={20} />
              <span>Order ID</span>
              <b>{orderId}</b>
            </div>
            <div className="success-step">
              <Truck size={20} />
              <span>Status</span>
              <b>Paid demo</b>
            </div>
            <div className="success-step">
              <Home size={20} />
              <span>Total</span>
              <b>{state?.total ? currency.format(state.total) : "Calculated"}</b>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link className="primary-button" to="/marketplace">
              Continue shopping <ArrowRight size={18} />
            </Link>
            <Link className="secondary-dark-button" to="/dashboard">View dashboard</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
