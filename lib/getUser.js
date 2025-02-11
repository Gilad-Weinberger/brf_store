import User from "./models/userModel";
import Cart from "./models/cartModel";

export default async function getUser(user) {
  try {
    let existingUser = await User.findOne({ email: user.email });

    if (!existingUser) {
      existingUser = new User({
        name: user.name,
        email: user.email,
        image: user.image,
      });
      await existingUser.save();
    }

    // Ensure the cart exists
    await fetchCart(existingUser);

    // Convert Mongoose document to plain object and stringify _id
    return {
      _id: existingUser._id.toString(), // Convert ObjectId to string
      name: existingUser.name,
      email: existingUser.email,
      image: existingUser.image,
    };
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return null;
  }
}

// Function to ensure the user has a cart
async function fetchCart(user) {
  const userCart = await Cart.findOne({ user: user._id });
  if (!userCart) {
    await new Cart({ user: user._id, products: [] }).save();
  }
}
