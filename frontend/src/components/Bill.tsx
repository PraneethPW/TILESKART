import { currency } from "../lib";

type BillProps = {
  subtotal: number;
  deliveryFee: number;
  gst: number;
  total: number;
};

export function Bill({ subtotal, deliveryFee, gst, total }: BillProps) {
  return (
    <div className="mt-5 rounded bg-stone-100 p-4 text-sm">
      <div className="bill-line">
        <span>Subtotal</span>
        <b>{currency.format(subtotal)}</b>
      </div>
      <div className="bill-line">
        <span>Delivery</span>
        <b>{deliveryFee ? currency.format(deliveryFee) : "Free"}</b>
      </div>
      <div className="bill-line">
        <span>GST 18%</span>
        <b>{currency.format(gst)}</b>
      </div>
      <div className="bill-line border-t border-stone-300 pt-3 text-lg">
        <span>Total</span>
        <b>{currency.format(total)}</b>
      </div>
    </div>
  );
}
