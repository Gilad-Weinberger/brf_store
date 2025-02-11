const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartProductSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    size: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const CartProduct =
  mongoose.models.CartProduct ||
  mongoose.model("CartProduct", CartProductSchema);

module.exports = CartProduct;
