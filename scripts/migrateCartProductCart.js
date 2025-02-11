require("dotenv").config();
const mongoose = require("mongoose");
const Cart = require("../lib/models/cartModel.js");
const CartProduct = require("../lib/models/cartProductModel.js");
const Product = require("../lib/models/productModel.js");
const dbConnect = require("../lib/mongodb.js");

async function migrateCarts() {
  try {
    await dbConnect();

    const carts = await Cart.find({ products: { $exists: true, $ne: [] } });

    for (const cart of carts) {
      const cartProductIds = [];

      for (const productId of cart.products) {
        const product = await Product.findById(productId);
        if (!product) continue;

        const cartProduct = await CartProduct.create({
          product: product._id,
          size: "default", // Set a default value (modify based on your needs)
          color: "default",
        });

        cartProductIds.push(cartProduct._id);
      }

      // Update the cart with new cartProducts
      await Cart.updateOne(
        { _id: cart._id },
        { $set: { cartProducts: cartProductIds }, $unset: { products: "" } },
      );
    }

    console.log(`Migrated ${carts.length} carts successfully`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateCarts();
