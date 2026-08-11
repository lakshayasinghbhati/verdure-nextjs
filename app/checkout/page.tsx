"use client";
import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ShieldCheck, MapPin, CheckCircle2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const items = useCartStore((s) => Object.values(s.items));
  const clear = useCartStore((s) => s.clear);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const [step, setStep] = useState<"address" | "payment" | "processing" | "success">("address");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  const address = {
    line1: "C-12, Malviya Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302017",
  };

  async function payNow() {
    setError("");
    setStep("processing");
    try {
      const res = await fetch("/api/payments/create-order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
      items: items.map(i => ({
        productId: i.productId,
        qty: i.qty,
      })),
      address,
  }),
});

const data = await res.json();
      
      console.log("RAZORPAY DATA:", data);
      if (!res.ok) throw new Error(data.error || "Could not start checkout.");
      console.log(data);
      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Verdure",
        description: "Grocery order",
        order_id: data.razorpayOrderId,
        theme: { color: "#FF7A3C" },
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderId, ...response }),
          });
          const verifyData = await verifyRes.json();
          if (verifyRes.ok) {
            clear();
            setOrderId(data.orderId);
            setStep("success");
          } else {
            setError(verifyData.error || "Payment verification failed.");
            setStep("payment");
          }
        },
        modal: { ondismiss: () => setStep("payment") },
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message);
      setStep("payment");
    }
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <p className="text-porcelain/60 mb-4">Sign in to check out.</p>
        <a href="/signin" className="bg-citrus text-ink font-semibold px-6 py-3 rounded-full inline-block">Sign in</a>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-14">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {step === "address" && (
        <>
          <h1 className="font-display text-3xl mb-1">Delivery address</h1>
          <p className="text-sm text-porcelain/50 mb-6">Where should we bring the basket?</p>
          <div className="flex items-start gap-3 bg-white/5 border border-citrus/50 rounded-xl px-4 py-3 mb-4">
            <MapPin className="w-4 h-4 mt-0.5 text-citrus" />
            <div className="text-sm">
              <p className="font-medium">Home</p>
              <p className="text-porcelain/50">{address.line1}, {address.city}, {address.state} {address.pincode}</p>
            </div>
          </div>
          <button
            onClick={() => setStep("payment")}
            className="w-full bg-citrus text-ink font-semibold py-3.5 rounded-full hover:brightness-110 transition"
          >
            Continue to payment
          </button>
        </>
      )}

      {step === "payment" && (
        <>
          <h1 className="font-display text-3xl mb-1">Payment</h1>
          <p className="text-sm text-porcelain/50 mb-6">Review and pay securely.</p>
          <div className="flex justify-between text-sm mb-4 bg-white/5 rounded-xl px-4 py-3">
            <span className="text-porcelain/60">Order total</span>
            <span className="font-mono font-semibold">{inr(total)}</span>
          </div>
          {error && <p className="text-sm text-citrus mb-3">{error}</p>}
          <button
            onClick={payNow}
            className="w-full bg-[#00A76E] text-white font-semibold py-3.5 rounded-full hover:brightness-110 transition flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" /> Pay securely with Razorpay
          </button>
        </>
      )}

      {step === "processing" && (
        <div className="py-16 text-center">
          <div className="w-10 h-10 mx-auto rounded-full border-2 border-citrus border-t-transparent animate-spin mb-5" />
          <p className="font-display text-xl">Opening secure checkout…</p>
        </div>
      )}

      {step === "success" && orderId && (
        <div className="py-6 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-leaf flex items-center justify-center mb-5">
            <CheckCircle2 className="w-9 h-9 text-ink" />
          </div>
          <h1 className="font-display text-3xl mb-1">Order confirmed</h1>
          <p className="text-sm text-porcelain/50 mb-6">Order #{orderId}</p>
          <button
            onClick={() => router.push(`/orders/${orderId}`)}
            className="bg-porcelain text-ink font-semibold px-6 py-3 rounded-full hover:bg-white transition inline-flex items-center gap-2"
          >
            Track order <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
