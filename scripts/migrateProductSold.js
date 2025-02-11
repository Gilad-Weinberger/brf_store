require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../lib/models/productModel.js");
const dbConnect = require("../lib/mongodb.js");

async function migrateProducts() {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Update products: add `soldCount` with default value 0
    const result = await Product.updateMany(
      { sold: { $exists: false } }, // Only update if `soldCount` is missing
      { $set: { sold: 0 } },
    );

    console.log(`Updated ${result.modifiedCount} products to include sold`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateProducts();
