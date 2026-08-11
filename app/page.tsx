import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";

export default function HomePage() {
  return (
    <main>
      <div className="bg-leaf text-ink text-center text-[13px] font-medium py-2 tracking-wide">
        Free same-day delivery on orders over ₹499
      </div>
      <Hero />
      <ProductGrid />
      <footer className="border-t border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row justify-between gap-4 text-sm text-porcelain/45">
          <span className="font-display text-lg text-porcelain/80">Verdure</span>
          <p>Real checkout runs through Razorpay in test mode by default.</p>
        </div>
      </footer>
    </main>
  );
}
