"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductCard, { Product } from "@/components/ProductCard";
import { useSearchStore } from "../store/useSearchStore";

const CATEGORIES = [
  { id: "all", label: "All aisles" },
  { id: "produce", label: "Fresh Produce" },
  { id: "dairy", label: "Dairy & Eggs" },
  { id: "bakery", label: "Bakery" },
  { id: "pantry", label: "Pantry & Staples" },
  { id: "beverages", label: "Beverages" },
  { id: "snacks", label: "Snacks & Treats" },
];

export default function ProductGrid() {
  const search = useSearchStore((s) => s.search);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search);
    if (category !== "all") params.set("category", category);
    if (sort !== "popular") params.set("sort", sort);

    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, [category, sort, search]);

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-5 md:px-8 pb-24">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategory(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm border transition ${
              category === c.id ? "bg-porcelain text-ink border-transparent" : "border-white/10 text-porcelain/70 hover:bg-white/5"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="font-display text-2xl">{CATEGORIES.find((c) => c.id === category)?.label}</h2>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-full text-sm pl-4 pr-9 py-2 focus:outline-none focus:ring-2 focus:ring-citrus/50"
          >
            <option value="popular" className="text-black">Most popular</option>
            <option value="priceLow" className="text-black">Price: Low to high</option>
            <option value="priceHigh" className="text-black">Price: High to low</option>
            <option value="rating" className="text-black">Top rated</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-porcelain/50" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.04] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-porcelain/50">
          <p className="font-display text-xl mb-1">Nothing on the shelf here yet</p>
          <p className="text-sm">Run <code>npm run seed</code> to populate the catalog.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
