import mongoose, { Schema, models, model, Types } from "mongoose";

const AddressSchema = new Schema(
  {
    label: { type: String, default: "Home" },
    line1: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);
interface IUser {
  name: string;
  email: string;
  passwordHash?: string;
  image?: string;
  role: "customer" | "admin";
  addresses: Types.ObjectId[];
  wishlist: Types.ObjectId[];
}
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String }, // absent for OAuth (Google) users
    image: String,
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [AddressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default (models.User as mongoose.Model<IUser>) || model<IUser>("User", UserSchema);