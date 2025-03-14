import express from "express";
import Purchase from "../models/Purchase";

const router = express.Router();

// ➤ CREATE a new purchase
router.post("/", async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    const savedPurchase = await newPurchase.save();
    res.status(201).json(savedPurchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➤ READ all purchases for a user
router.get("/:userId", async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.params.userId });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➤ UPDATE a purchase
router.put("/:id", async (req, res) => {
  try {
    const updatedPurchase = await Purchase.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedPurchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➤ DELETE a purchase
router.delete("/:id", async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
