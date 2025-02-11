const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
  },
  { timestamps: true },
);

// Check if the model already exists before creating it
const Brand = mongoose.models.Brand || mongoose.model("Brand", BrandSchema);

module.exports = Brand;
