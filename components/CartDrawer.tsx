"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Minus, Plus, ShoppingBasket, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

export default function CartDrawer({ onClose }: { onClose: () => void }) {
  const items = useCartStore((s) => Object.values(s.items));
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 40;
  const total = subtotal + deliveryFee;
  const router = useRouter();

  return (
    <div className="fixed inset-0 z-40">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60" onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-inkSoft border-l border-white/10 flex flex-col"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <h3 className="font-display text-xl">Your basket ({items.reduce((s, i) => s + i.qty, 0)})</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-porcelain/45">
              <ShoppingBasket className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Your basket is empty. Fresh things are waiting in the aisles.</p>
            </div>
          ) : (
            <>
              <div className="p-5 space-y-4">
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <motion.div
                      key={i.productId}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">{i.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{i.name}</p>
                        <p className="text-xs text-porcelain/45">{i.unit}</p>
                      </div>
                      <div className="flex items-center gap-2 bg-white/5 rounded-full px-1 py-1">
                        <button onClick={() => dec(i.productId)} className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="text-xs font-mono w-4 text-center">{i.qty}</span>
                        <button onClick={() => inc(i.productId)} className="w-6 h-6 rounded-full hover:bg-white/10 flex items-center justify-center"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <span className="font-mono text-sm w-16 text-right shrink-0">{inr(i.price * i.qty)}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="p-5 border-t border-white/10 space-y-2 mt-auto">
                <div className="flex justify-between text-sm text-porcelain/60"><span>Subtotal</span><span className="font-mono">{inr(subtotal)}</span></div>
                <div className="flex justify-between text-sm text-porcelain/60"><span>Delivery</span><span className="font-mono">{deliveryFee === 0 ? "Free" : inr(deliveryFee)}</span></div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-white/10"><span>Total</span><span className="font-mono">{inr(total)}</span></div>
                <button
                  onClick={() => { onClose(); router.push("/checkout"); }}
                  className="w-full mt-3 bg-citrus text-ink font-semibold py-3.5 rounded-full hover:brightness-110 transition flex items-center justify-center gap-2"
                >
                  Proceed to pay <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
