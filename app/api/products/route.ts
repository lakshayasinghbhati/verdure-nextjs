import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

// GET /api/products?category=produce&q=apple&sort=priceLow
export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");
  const sort = searchParams.get("sort");

  const filter: Record<string, any> = {};
  if (category && category !== "all") filter.category = category;
  if (q) {
    filter.$or = [
  { name: { $regex: q, $options: "i" } },
  { category: { $regex: q, $options: "i" } },
  { description: { $regex: q, $options: "i" } },
];
  }
  let cursor = Product.find(filter);
  if (sort === "priceLow") cursor = cursor.sort({ price: 1 });
  else if (sort === "priceHigh") cursor = cursor.sort({ price: -1 });
  else if (sort === "rating") cursor = cursor.sort({ rating: -1 });
  else cursor = cursor.sort({ createdAt: -1 });

  const products = await cursor.lean();
  return NextResponse.json(products);
}

// POST /api/products  (admin only — create a product)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  await connectDB();
  const body = await req.json();
  const product = await Product.create(body);
  return NextResponse.json(product, { status: 201 });
}
