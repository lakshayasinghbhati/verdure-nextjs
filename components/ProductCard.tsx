"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Minus, Plus, Star, AlertTriangle } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number;
  unit: string;
  emoji: string;
  rating: number;
  badge?: string | null;
  stock: number;
};

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

export default function ProductCard({ product }: { product: Product }) {
  const item = useCartStore((s) => s.items[product._id]);
  const add = useCartStore((s) => s.add);
  const inc = useCartStore((s) => s.inc);
  const dec = useCartStore((s) => s.dec);
  const wished = useWishlistStore((s) => s.has(product._id));
  const toggleWish = useWishlistStore((s) => s.toggle);

  const qty = item?.qty || 0;
  const discount = product.mrp ? Math.round(100 - (product.price / product.mrp) * 100) : 0;
  const lowStock = product.stock <= 5;

  const addItem = () =>
    add({ productId: product._id, name: product.name, price: product.price, unit: product.unit, emoji: product.emoji });

  return (
    <div className="group relative bg-white/[0.04] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.07] hover:border-white/20 transition-all duration-300">
      <button
        onClick={() => toggleWish(product._id)}
        aria-label="Toggle wishlist"
        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-ink/60 hover:bg-ink transition"
      >
        <Heart className={`w-4 h-4 transition-colors ${wished ? "fill-citrus text-citrus" : "text-porcelain/60"}`} />
      </button>
      {product.badge && (
        <span className="absolute top-3 left-3 z-10 text-[10px] font-semibold uppercase tracking-wide bg-leaf text-ink px-2 py-1 rounded-full">
          {product.badge}
        </span>
      )}
      <div className="h-28 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/[0.06] to-transparent mb-3 text-5xl group-hover:scale-105 transition-transform duration-300">
        {product.emoji}
      </div>
      <p className="text-sm font-medium leading-snug">{product.name}</p>
      <div className="flex items-center gap-1 mt-1 text-[11px] text-porcelain/45">
        <span>{product.unit}</span>
        <span>•</span>
        <Star className="w-3 h-3 fill-citrus text-citrus" />
        <span>{product.rating}</span>
      </div>
      {lowStock && (
        <p className="text-[11px] text-citrus mt-1 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Only {product.stock} left
        </p>
      )}
      <div className="flex items-end justify-between mt-3">
        <div className="font-mono">
          <span className="text-[15px] font-semibold">{inr(product.price)}</span>
          {product.mrp && <span className="ml-1.5 text-[11px] text-porcelain/35 line-through">{inr(product.mrp)}</span>}
          {discount > 0 && <div className="text-[10px] text-leaf">{discount}% off</div>}
        </div>
        <AnimatePresence mode="wait" initial={false}>
          {qty === 0 ? (
            <motion.button
              key="add"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              onClick={addItem}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-porcelain text-ink hover:bg-white transition"
            >
              Add
            </motion.button>
          ) : (
            <motion.div
              key="stepper"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="flex items-center gap-2.5 bg-porcelain text-ink rounded-full px-1 py-1"
            >
              <button onClick={() => dec(product._id)} className="w-6 h-6 rounded-full hover:bg-black/10 flex items-center justify-center transition">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-semibold font-mono w-4 text-center">{qty}</span>
              <button onClick={() => inc(product._id)} className="w-6 h-6 rounded-full hover:bg-black/10 flex items-center justify-center transition">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
