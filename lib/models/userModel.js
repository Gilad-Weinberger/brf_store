const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, required: true },
  },
  { timestamps: true },
);

// Check if the model already exists before creating it
const User = mongoose.models.User || mongoose.model("User", UserSchema);

module.exports = User;
