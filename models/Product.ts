import mongoose from "mongoose";

const { Schema, models, model } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      required: true,
      enum: ["produce", "dairy", "bakery", "pantry", "beverages", "snacks"],
    },
    price: { type: Number, required: true },
    mrp: { type: Number },
    unit: { type: String, required: true }, // e.g. "1 kg", "500 ml"
    emoji: { type: String, default: "🛒" },
    imageUrl: { type: String },
    rating: { type: Number, default: 4.5 },
    badge: { type: String, enum: ["New", "Bestseller", "Organic", "Seasonal", null], default: null },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

ProductSchema.index({ name: "text", description: "text" });

export default models.Product || model("Product", ProductSchema);
