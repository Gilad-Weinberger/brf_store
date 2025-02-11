const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "CartProduct",
      },
    ],
  },
  { timestamps: true },
);

const Cart = mongoose.models.Cart || mongoose.model("Cart", CartSchema);

module.exports = Cart;
