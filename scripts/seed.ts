/**
 * Seeds MongoDB with the Verdure product catalog.
 * Run with: npm run seed   (requires MONGODB_URI in .env.local)
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product";

dotenv.config({ path: ".env.local" });

const PRODUCTS = [
  { name: "Shimla Apple", category: "produce", price: 189, mrp: 220, unit: "1 kg", emoji: "🍎", rating: 4.7, badge: "Bestseller", stock: 42 },
  { name: "Robusta Banana", category: "produce", price: 59, mrp: 69, unit: "6 pcs", emoji: "🍌", rating: 4.5, badge: null, stock: 120 },
  { name: "Hass Avocado", category: "produce", price: 249, unit: "2 pcs", emoji: "🥑", rating: 4.8, badge: "Organic", stock: 18 },
  { name: "Alphonso Mango", category: "produce", price: 449, mrp: 499, unit: "1 kg", emoji: "🥭", rating: 4.9, badge: "Seasonal", stock: 9 },
  { name: "Green Seedless Grapes", category: "produce", price: 129, unit: "500 g", emoji: "🍇", rating: 4.4, badge: null, stock: 55 },
  { name: "Vine Tomato", category: "produce", price: 79, mrp: 89, unit: "500 g", emoji: "🍅", rating: 4.3, badge: null, stock: 63 },
  { name: "Baby Spinach", category: "produce", price: 45, unit: "200 g", emoji: "🥬", rating: 4.6, badge: "Organic", stock: 4 },
  { name: "Full Cream Milk", category: "dairy", price: 68, unit: "1 L", emoji: "🥛", rating: 4.7, badge: null, stock: 88 },
  { name: "Free-range Eggs", category: "dairy", price: 99, mrp: 115, unit: "6 pcs", emoji: "🥚", rating: 4.8, badge: "Bestseller", stock: 30 },
  { name: "Artisan Aged Cheddar", category: "dairy", price: 320, unit: "200 g", emoji: "🧀", rating: 4.9, badge: "New", stock: 12 },
  { name: "Greek Yogurt", category: "dairy", price: 145, mrp: 160, unit: "400 g", emoji: "🍦", rating: 4.6, badge: null, stock: 22 },
  { name: "Sourdough Loaf", category: "bakery", price: 175, unit: "500 g", emoji: "🍞", rating: 4.8, badge: "New", stock: 7 },
  { name: "Butter Croissant", category: "bakery", price: 95, unit: "2 pcs", emoji: "🥐", rating: 4.7, badge: null, stock: 15 },
  { name: "Aged Basmati Rice", category: "pantry", price: 399, mrp: 450, unit: "5 kg", emoji: "🍚", rating: 4.6, badge: "Bestseller", stock: 40 },
  { name: "Wild Forest Honey", category: "pantry", price: 349, unit: "350 g", emoji: "🍯", rating: 4.9, badge: "Organic", stock: 26 },
  { name: "Cold-pressed Olive Oil", category: "pantry", price: 599, mrp: 650, unit: "1 L", emoji: "🫒", rating: 4.8, badge: null, stock: 3 },
  { name: "Cold Brew Coffee", category: "beverages", price: 210, unit: "500 ml", emoji: "☕", rating: 4.5, badge: "New", stock: 33 },
  { name: "Sparkling Yuzu Water", category: "beverages", price: 89, unit: "330 ml", emoji: "🥤", rating: 4.4, badge: null, stock: 60 },
  { name: "Dark Chocolate 70%", category: "snacks", price: 175, mrp: 199, unit: "100 g", emoji: "🍫", rating: 4.8, badge: "Bestseller", stock: 48 },
  { name: "Roasted Almonds", category: "snacks", price: 289, unit: "250 g", emoji: "🥜", rating: 4.6, badge: "Organic", stock: 20 },
];

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI in .env.local first.");
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected. Clearing existing products…");
  await Product.deleteMany({});

  const docs = PRODUCTS.map((p) => ({ ...p, slug: slugify(p.name) }));
  await Product.insertMany(docs);

  console.log(`Seeded ${docs.length} products.`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
