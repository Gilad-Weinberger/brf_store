const AddProductToCart = async (user, product, selectedColor, selectedSize) => {
  try {
    if (!selectedColor || !selectedSize) {
      console.log("Please select a color and size.");
      return;
    }
    // Fetch the user's cart
    const response = await fetch("/api/carts");
    if (!response.ok) throw new Error("Error fetching cart");

    const data = await response.json();
    const userCart = data.data.find((c) => c.user._id === user._id);

    if (!userCart) {
      console.log("No cart found.");
      return;
    }

    // Create a new cart product
    const cartProduct = {
      product: product._id,
      color: selectedColor,
      size: selectedSize,
    };

    const cartProductResponse = await fetch("/api/cartProducts", {
      method: "POST",
      body: JSON.stringify(cartProduct),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!cartProductResponse.ok) {
      throw new Error("Error creating cart product");
    }

    const newCartProduct = await cartProductResponse.json();

    // Update the cart with the new product
    const updatedCart = {
      ...userCart,
      products: [...userCart.products, newCartProduct.data._id],
    };

    const updateCartResponse = await fetch(`/api/carts/${userCart._id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCart),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!updateCartResponse.ok) {
      throw new Error("Error updating cart");
    }

    console.log("Product added to cart!");
  } catch (err) {
    console.error("Error adding product to cart:", err);
    console.log("Error adding product to cart.");
  }
};

const RemoveProductFromCart = async (user, item) => {
  try {
    const response = await fetch("/api/carts");
    if (!response.ok) throw new Error("Error fetching cart");

    const data = await response.json();
    const userCart = data.data.find((c) => c.user._id === user._id);

    if (!userCart) {
      console.log("No cart found.");
      return;
    }

    // Find the matching cart product
    const cartProductIndex = userCart.products.findIndex((cartProduct) => {
      return (
        cartProduct.product._id === item.product._id &&
        cartProduct.color === item.color &&
        cartProduct.size === item.size
      );
    });

    if (cartProductIndex === -1) {
      console.log("Product not found in cart.");
      return;
    }

    const cartProductToRemove = userCart.products[cartProductIndex];

    // Remove the cart product from the cart
    const removeCartProductResponse = await fetch(
      `/api/cartProducts/${cartProductToRemove._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!removeCartProductResponse.ok) {
      throw new Error("Error removing cart product");
    }

    // Update the cart's product list
    const updatedCart = {
      ...userCart,
      products: userCart.products.filter(
        (cartProduct) => cartProduct._id !== cartProductToRemove._id,
      ),
    };

    // Update the cart with the new product list
    const updateCartResponse = await fetch(`/api/carts/${userCart._id}`, {
      method: "PUT",
      body: JSON.stringify(updatedCart),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!updateCartResponse.ok) {
      throw new Error("Error updating cart");
    }

    console.log("Product removed from cart!");
  } catch (err) {
    console.error("Error removing product from cart:", err);
    console.log("Error removing product from cart.");
  }
};

export { AddProductToCart, RemoveProductFromCart };
