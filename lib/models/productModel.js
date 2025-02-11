const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    images: [{ type: String, required: true }],
    colors: [{ type: String, required: true }],
    sizes: [{ type: String, required: true }],
    price: { type: Number, required: true },
    description: { type: String, required: true },
    count: { type: Number, required: true },
    sold: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
