"use client";
import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useEffect, useState } from "react";
import type { Product } from "@/components/ProductCard";

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

export default function WishlistDrawer({ onClose }: { onClose: () => void }) {
  const ids = useWishlistStore((s) => s.ids);
  const toggle = useWishlistStore((s) => s.toggle);
  const add = useCartStore((s) => s.add);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (ids.length === 0) { setProducts([]); return; }
    Promise.all(ids.map((id) => fetch(`/api/products/${id}`).then((r) => r.json()))).then(setProducts);
  }, [ids]);

  return (
    <div className="fixed inset-0 z-40">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60" onClick={onClose} />
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-inkSoft border-l border-white/10 flex flex-col"
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <h3 className="font-display text-xl">Wishlist ({ids.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {products.length === 0 ? (
            <div className="p-8 text-center text-porcelain/45">
              <Heart className="w-8 h-8 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nothing saved yet. Tap the heart on anything you love.</p>
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {products.map((p) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-2xl shrink-0">{p.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.name}</p>
                    <p className="font-mono text-xs text-porcelain/60">{inr(p.price)}</p>
                  </div>
                  <button
                    onClick={() => { add({ productId: p._id, name: p.name, price: p.price, unit: p.unit, emoji: p.emoji }); toggle(p._id); }}
                    className="text-xs font-semibold px-3 py-2 rounded-full bg-porcelain text-ink hover:bg-white transition"
                  >
                    Move to basket
                  </button>
                  <button onClick={() => toggle(p._id)} className="p-2 hover:bg-white/10 rounded-full transition"><X className="w-4 h-4 text-porcelain/40" /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
