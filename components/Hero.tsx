"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

// R3F needs the browser's WebGL context, so it's loaded client-side only —
// this also keeps the Three.js bundle out of the server render entirely.
const FloatingFruits = dynamic(() => import("@/components/three/FloatingFruits"), {
  ssr: false,
  loading: () => <div className="w-full h-full" />,
});

export default function Hero() {
  return (
    <header className="relative overflow-hidden max-w-7xl mx-auto px-5 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-leaf mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Fresh, curated, delivered
          </div>
          <h1 className="font-display text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Grocery,
            <br />
            elevated.
          </h1>
          <p className="mt-5 text-porcelain/65 text-base md:text-lg max-w-md">
            Hand-picked produce, dairy, and pantry staples — sourced daily and
            on your counter in under 40 minutes.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 bg-citrus text-ink font-semibold px-6 py-3.5 rounded-full hover:brightness-110 transition"
            >
              Shop fresh arrivals <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        <div className="relative h-[380px] md:h-[460px]">
          <FloatingFruits />
        </div>
      </div>
    </header>
  );
}
