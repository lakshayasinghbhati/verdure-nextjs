import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import Link from "next/link";
import AdminOrderStatus from "@/components/AdminOrderStatus";
import { TrendingUp, ShoppingBasket, AlertTriangle, Package } from "lucide-react";

const inr = (n: number) => "\u20B9" + n.toLocaleString("en-IN");

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  await connectDB();

  const [products, orders] = await Promise.all([
    Product.find().lean(),
    Order.find().sort({ createdAt: -1 }).limit(50).lean(),
  ]);

  const revenue = orders.filter((o) => o.payment?.status === "paid").reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 10);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs uppercase tracking-widest text-leaf mb-1">Signed in as {session?.user?.name}</p>
          <h1 className="font-display text-3xl">Store dashboard</h1>
        </div>
        <Link href="/admin/inventory" className="flex items-center gap-2 text-sm border border-white/15 px-4 py-2.5 rounded-full hover:bg-white/5 transition">
          <Package className="w-4 h-4" /> Manage inventory
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total revenue", value: inr(revenue), icon: TrendingUp },
          { label: "Orders", value: orders.length, icon: ShoppingBasket },
          { label: "Products listed", value: products.length, icon: Package },
          { label: "Low stock alerts", value: lowStock.length, icon: AlertTriangle },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
            <s.icon className="w-4 h-4 mb-3 text-leaf" />
            <p className="font-mono text-2xl font-semibold">{s.value}</p>
            <p className="text-xs text-porcelain/45 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-5">
        <h3 className="font-display text-lg mb-4">Recent orders</h3>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-porcelain/45 text-xs uppercase tracking-wide">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.map((o) => (
                <tr key={o._id.toString()}>
                  <td className="py-2.5 font-mono text-xs">{o._id.toString().slice(-8)}</td>
                  <td className="py-2.5 font-mono">{inr(o.total)}</td>
                  <td className="py-2.5 text-porcelain/60 capitalize">{o.payment?.status}</td>
                  <td className="py-2.5">
  <AdminOrderStatus
    orderId={o._id.toString()}
    currentStatus={o.status}
  />
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
