// Next.js\brf_store\scripts\migrateProducts.js
require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../lib/models/productModel.js");
const Brand = require("../lib/models/brandModel.js");
const dbConnect = require("../lib/mongodb.js");

async function migrateProducts() {
  try {
    // Connect to MongoDB
    console.log("MONGODB_URI:", process.env.MONGODB_URI);
    await dbConnect();

    // Find or create default brand
    const defaultBrand = await Brand.findOne({
      name: "Default Brand",
      logo: "https://static.vecteezy.com/system/resources/previews/010/994/239/non_2x/adidas-logo-black-symbol-clothes-design-icon-abstract-football-illustration-with-white-background-free-vector.jpg",
    });

    let brandId = defaultBrand?._id;

    if (!defaultBrand) {
      const newBrand = await Brand.create({
        name: "Default Brand",
        logo: "https://static.vecteezy.com/system/resources/previews/010/994/239/non_2x/adidas-logo-black-symbol-clothes-design-icon-abstract-football-illustration-with-white-background-free-vector.jpg",
      });
      brandId = newBrand._id;
    }

    // Update products
    const result = await Product.updateMany(
      { brand: { $exists: false } },
      { $set: { brand: brandId } },
    );

    console.log(`Updated ${result.modifiedCount} products`);
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrateProducts();
