
const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
      {
        name: { type: String, require: true, unique:true },
        description: { type: String, require: true },
        price: { type: Number, require: true },
      },
  { collection: "products" }
);

module.exports = mongoose.model("products", ProductSchema, "products");