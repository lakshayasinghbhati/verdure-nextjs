import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";

const VALID = ["placed", "packed", "out_for_delivery", "delivered", "cancelled"];

// PUT { status }  (admin only — moves an order through fulfillment states)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  console.log("SESSION:", session);
console.log("ROLE:", session?.user?.role);
  console.log("API ROLE:", session?.user?.role);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { status } = await req.json();
  if (!VALID.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  await connectDB();
  const order = await Order.findByIdAndUpdate(params.id, { status }, { new: true });
  const user = await User.findById(order.user);
  if (user?.email && status === "out_for_delivery") {
  await sendEmail(
    user.email,
    "Your Order is Out for Delivery",
    `
      <h2>Out for Delivery</h2>
      <p>Your order is on the way and should arrive soon.</p>
    `
  );
}
if (user?.email && status === "delivered") {
  await sendEmail(
    user.email,
    "Order Delivered",
    `
      <h2>Order Delivered</h2>
      <p>Your order has been delivered successfully.</p>
      <p>Thank you for shopping with Verdure.</p>
    `
  );
}
  return NextResponse.json(order);
}
