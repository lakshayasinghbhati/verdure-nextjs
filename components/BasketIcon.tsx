"use client";
import { motion } from "framer-motion";
import { ShoppingBasket } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export default function BasketIcon({ onClick }: { onClick: () => void }) {
  const count = useCartStore((s) => s.count());
  const bump = useCartStore((s) => s.bump);

  return (
    <motion.button
      onClick={onClick}
      aria-label="Open basket"
      animate={bump ? { scale: [1, 1.24, 0.94, 1], rotate: [0, -9, 5, 0] } : { scale: 1, rotate: 0 }}
      transition={{ duration: 0.42, ease: [0.34, 1.56, 0.64, 1] }}
      className="relative flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-porcelain text-ink hover:bg-white transition-colors"
    >
      <ShoppingBasket className="w-5 h-5" />
      <motion.span
        key={count}
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        className="text-sm font-semibold font-mono w-4 text-center"
      >
        {count}
      </motion.span>
    </motion.button>
  );
}
