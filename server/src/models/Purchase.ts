import mongoose from "mongoose";

const PurchaseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    itemName: { type: String, required: true },
    amount: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Purchase", PurchaseSchema);
