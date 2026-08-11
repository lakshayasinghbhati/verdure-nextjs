import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Order from "@/models/Order";
import { connectDB } from "@/lib/mongodb";

async function getOrders() {
  const session = await getServerSession(authOptions);

  if (!session) return [];

  await connectDB();

  const orders = await Order.find({
  user: session.user.id,
})
.sort({ createdAt: -1 })
.lean();

return orders.map((order: any) => ({
  ...order,
  _id: order._id.toString(),
  user: order.user.toString(),
}));
}

export default async function OrdersPage() {
  const orders = (await getOrders()).filter(
  (order: any) => order.status !== "cancelled"
);

  console.log("ORDERS LENGTH:", orders.length);
  console.log("ORDERS PAGE:", orders);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-6">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <Link
  key={order._id}
  href={`/orders/${order._id}`}
  className="block rounded-2xl border border-white/10 p-6 hover:border-white/20"
>
  <p className="font-semibold text-lg">
    {order.items[0]?.name}
    {order.items.length > 1 &&
      ` + ${order.items.length - 1} more item(s)`}
  </p>

  <p className="text-white/70 mt-1">
    {order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹{order.total}
  </p>

  <p className="text-white/70">
    {order.status.charAt(0).toUpperCase() + order.status.slice(1)} •{" "}
    {new Date(order.createdAt).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}
  </p>
</Link>
          ))}
        </div>
      )}
    </div>
  );
}