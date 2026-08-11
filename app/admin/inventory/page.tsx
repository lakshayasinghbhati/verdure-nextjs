"use client";
import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

type Product = {
  _id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  stock: number;
};

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, []);

  async function updateStock(id: string, stock: number) {
    setSavingId(id);
    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock }),
    });
    if (res.ok) {
      setProducts((prev) => prev.map((p) => (p._id === id ? { ...p, stock } : p)));
    }
    setSavingId(null);
  }

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
      <h1 className="font-display text-3xl mb-1">Inventory</h1>
      <p className="text-sm text-porcelain/50 mb-8">Update stock levels — changes save immediately.</p>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-porcelain/45 text-xs uppercase tracking-wide">
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Stock</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p._id}>
                <td className="py-3 flex items-center gap-2">
                  <span>{p.emoji}</span> {p.name}
                </td>
                <td className="py-3 text-porcelain/60 capitalize">{p.category}</td>
                <td className="py-3 font-mono">{inr(p.price)}</td>
                <td className="py-3">
                  <input
                    type="number"
                    defaultValue={p.stock}
                    onBlur={(e) => updateStock(p._id, Number(e.target.value))}
                    className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-citrus/50"
                  />
                  {savingId === p._id && <span className="text-xs text-porcelain/40 ml-2">Saving…</span>}
                </td>
                <td className="py-3">
                  {p.stock <= 5 ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-citrus/20 text-citrus flex items-center gap-1 w-fit">
                      <AlertTriangle className="w-3 h-3" /> Critical
                    </span>
                  ) : p.stock <= 15 ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-porcelain/70 w-fit">Low</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-leaf/20 text-leaf w-fit">In stock</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
