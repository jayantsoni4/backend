// server.js
require("dotenv").config(); // Load variables from .env in local dev
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ Use PORT from Railway, fallback to 5000 locally
const PORT = process.env.PORT || 5000;

// ✅ Use MONGO_URI from Railway's environment variables
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// Schema & Model
const inventorySchema = new mongoose.Schema({
  date: String,
  partCode: String,
  product: String,
  model: String,
  capacity: String,
  currentStock: Number,
  stockIn: Number,
  stockOut: Number,
  total: Number,
});

const Inventory = mongoose.model("Inventory", inventorySchema);

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// === API Routes ===
app.get("/api/inventory", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/inventory", async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/inventory/:id", async (req, res) => {
  try {
    const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/inventory/:id", async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Use 0.0.0.0 for Railway compatibility
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
