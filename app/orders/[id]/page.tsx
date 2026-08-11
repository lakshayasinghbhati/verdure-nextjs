"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Package2, Truck, MapPin, Clock } from "lucide-react";

const STEPS = [
  { key: "placed", label: "Order placed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Package2 },
  { key: "out_for_delivery", label: "Out for delivery", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

export default function OrderTrackingPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);

  async function cancelOrder() {
  const res = await fetch(`/api/orders/${params.id}`, {
    method: "PATCH",
  });

  if (res.ok) {
    const updatedOrder = await res.json();
    setOrder(updatedOrder);
  }
}

  useEffect(() => {
    let active = true;
    async function poll() {
      const res = await fetch(`/api/orders/${params.id}`);
      if (res.ok && active) setOrder(await res.json());
    }
    poll();
    const interval = setInterval(poll, 5000); // reflects admin status updates live
    return () => { active = false; clearInterval(interval); };
  }, [params.id]);

  if (!order) return <div className="max-w-lg mx-auto px-5 py-24 text-center text-porcelain/50">Loading order…</div>;

  const statusIndex = STEPS.findIndex((s) => s.key === order.status);

  return (
  <div className="max-w-lg mx-auto px-5 py-14">
    <h1 className="font-display text-3xl mb-1">
      Order #{order._id}
    </h1>

    <p className="text-sm text-porcelain/50 mb-8 flex items-center gap-1.5">
      <Clock className="w-3.5 h-3.5" />
      {statusIndex < 3 ? "Arriving soon" : "Delivered"}
    </p>

    <div className="relative pl-2">
      <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-white/10" />

      <motion.div
        className="absolute left-[23px] top-2 w-0.5 bg-leaf"
        animate={{
          height: `${(Math.max(statusIndex, 0) / 3) * 100}%`,
        }}
        transition={{ duration: 0.7 }}
      />

      <div className="space-y-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const done = i <= statusIndex;

          return (
            <div
              key={s.key}
              className="flex items-center gap-4 relative"
            >
              <div className="w-11 h-11 rounded-full flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>

              <div>
                <p
                  className={`text-sm font-medium ${
                    done
                      ? "text-porcelain"
                      : "text-porcelain/35"
                  }`}
                >
                  {s.label}
                </p>

                {i === statusIndex && i < 3 && (
                  <p className="text-xs text-porcelain/40">
                    In progress...
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {order.status === "placed" && (
  <button
    onClick={cancelOrder}
    className="mt-8 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
  >
    Cancel Order
  </button>
)}
    </div>
  </div>
);
}
