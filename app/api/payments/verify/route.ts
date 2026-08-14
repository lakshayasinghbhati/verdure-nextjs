import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { sendEmail } from "@/lib/email";


// POST { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Verifies the HMAC signature Razorpay returns after checkout — this is the
// step that actually confirms money changed hands, never trust the client alone.
export async function POST(req: Request) {
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: "Payment verification failed." }, { status: 400 });
  }

  await connectDB();
  const order = await Order.findById(orderId);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  order.payment.razorpayPaymentId = razorpay_payment_id;
  order.payment.razorpaySignature = razorpay_signature;
  order.payment.status = "paid";
  order.status = "placed";
  await order.save();
  const user = await User.findById(order.user);
console.log("VERIFY ORDER USER ID:", order.user.toString());
console.log("VERIFY USER EMAIL:", user?.email);
console.log("ORDER USER ID:", order.user);
console.log("USER EMAIL:", user?.email);
console.log("EMAIL USER:", process.env.EMAIL_USER);

if (user?.email) {
  await sendEmail(
    user.email,
    "Order Confirmed - Verdure",
    `
      <h2>Order Confirmed</h2>
      <p>Your payment was successful.</p>
      <p>Order Total: ₹${order.total}</p>
      <p>Thank you for shopping with Verdure.</p>
    `
  );
}

  // Decrement stock now that payment is confirmed.
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.qty } });
  }

  return NextResponse.json({ verified: true, orderId: order._id });
}
