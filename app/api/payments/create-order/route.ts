import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { razorpay } from "@/lib/razorpay";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

// POST { items: [{ productId, qty }], address }
// Recomputes prices server-side from the DB — never trust client-sent totals.
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { items, address } = await req.json();
  if (!items?.length) return NextResponse.json({ error: "Basket is empty." }, { status: 400 });

  await connectDB();
  const productIds = items.map((i: any) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  let subtotal = 0;
  const orderItems = items.map((i: any) => {
    const p = products.find((p) => p._id.toString() === i.productId);
    if (!p) throw new Error("Unknown product in basket.");
    if (p.stock < i.qty) throw new Error(`${p.name} is out of stock.`);
    subtotal += p.price * i.qty;
    return { product: p._id, name: p.name, price: p.price, qty: i.qty };
  });

  const deliveryFee = 0;
const total = subtotal + deliveryFee;

const order = await Order.create({
  user: session.user.id,
  items: orderItems,
  subtotal,
  deliveryFee,
  total,
  address,

  payment: {
    status: total === 0 ? "paid" : "pending",
  },
});

if (total === 0) {
  return NextResponse.json({
    orderId: order._id,
    amount: 0,
    currency: "INR",
    freeOrder: true,
  });
}
  console.log("KEY ID:", process.env.RAZORPAY_KEY_ID);
  console.log(
    "SECRET LENGTH:",
    process.env.RAZORPAY_KEY_SECRET?.length
  );
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100), // paise
    currency: "INR",
    receipt: `ORD_${order._id.toString().slice(-8)}`
  });

  order.payment = { razorpayOrderId: razorpayOrder.id, status: "pending" };
  await order.save();

  return NextResponse.json({
    orderId: order._id,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
}
