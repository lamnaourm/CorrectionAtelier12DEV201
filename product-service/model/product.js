
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
      {
        name: { type: String },
        description: { type: String },
        price: { type: Number },
      },
  { collection: "products" }
);

module.exports = mongoose.model("products", ProductSchema, "products");