import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  await connectDB();
  const order = await Order.findById(params.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  if (order.user.toString() !== session.user.id && session.user.role !== "admin") {
    return NextResponse.json({ error: "Not your order." }, { status: 403 });
  }
  return NextResponse.json(order);
}
export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 }
    );
  }

  await connectDB();

  const order = await Order.findById(params.id);

  if (!order) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  if (order.user.toString() !== session.user.id) {
    return NextResponse.json(
      { error: "Not your order." },
      { status: 403 }
    );
  }

  if (order.status !== "placed") {
    return NextResponse.json(
      { error: "Order cannot be cancelled." },
      { status: 400 }
    );
  }

  order.status = "cancelled";
  await order.save();

  return NextResponse.json(order);
}
