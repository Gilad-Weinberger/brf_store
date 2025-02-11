"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AddProductToCart,
  RemoveProductFromCart,
} from "@/lib/ChangeCartFunctions";

const Cart = ({ user }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [groupedProducts, setGroupedProducts] = useState([]);

  // Fetch the user's cart on mount (or when user changes)
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const res = await fetch("/api/carts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch carts");

        // Find the cart for the current user
        const userCart = data.data.find((cart) => cart.user._id === user._id);
        setCart(userCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  useEffect(() => {
    if (cart) {
      // Group products by product._id and sum their quantities
      const grouped = cart.products.reduce((acc, item) => {
        const productId = item.product._id;
        if (!acc[productId]) {
          acc[productId] = { ...item, amount: 0 };
        }
        acc[productId].amount += item.amount !== undefined ? item.amount : 1;
        return acc;
      }, {});

      // Convert the grouped products object to an array
      setGroupedProducts(Object.values(grouped));
    }
  }, [cart]);

  if (loading) return <div>Loading...</div>;
  if (!cart) return <div>Your cart is empty.</div>;

  const IncreaseProductAmount = async (item) => {
    try {
      // Synchronize with the server
      await AddProductToCart(user, item.product, item.color, item.size);

      // Optimistically update the local state
      setGroupedProducts((prevGroupedProducts) => {
        return prevGroupedProducts.map((product) => {
          if (product.product._id === item.product._id) {
            return { ...product, amount: product.amount + 1 };
          }
          return product;
        });
      });
    } catch (error) {
      console.error("Error updating cart:", error);
      // Optionally, revert the local state change if the server update fails
    }
  };

  const DecreaseProductAmount = async (item) => {
    await RemoveProductFromCart(user, item);

    try {
      if (item.amount === 1) {
        // If the amount is 1, remove the product completely from the cart
        setGroupedProducts((prevGroupedProducts) =>
          prevGroupedProducts.filter(
            (product) => product.product._id !== item.product._id,
          ),
        );
      } else {
        // If the amount is greater than 1, just decrease the amount
        setGroupedProducts((prevGroupedProducts) => {
          return prevGroupedProducts.map((product) => {
            if (product.product._id === item.product._id) {
              return { ...product, amount: product.amount - 1 };
            }
            return product;
          });
        });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      // Optionally, revert the local state change if the server update fails
    }
  };

  // Calculate the total price for the entire cart
  const subTotalPrice = groupedProducts.reduce((acc, item) => {
    return acc + (item.product.price || 0) * item.amount;
  }, 0);
  const shipmentFees = 200;

  const totalPrice = subTotalPrice + shipmentFees;

  return (
    <div className="px-5 py-8">
      <h1 className="mb-8 text-3xl font-bold">Your Shopping Cart</h1>
      <div className="flex justify-between gap-8">
        <div className="flex-1">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-gray">
                <th className="px-4 py-2 text-left">Image</th>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 pl-[22px] text-left">Quantity</th>
                <th className="px-4 py-2 text-left">Total</th>
              </tr>
            </thead>
            <tbody>
              {groupedProducts.length > 0 ? (
                groupedProducts.map((item) => {
                  const itemTotal = (item.product.price || 0) * item.amount;
                  return (
                    <tr
                      key={item.product._id}
                      className="h-24 border-b border-gray"
                    >
                      <td className="px-4 py-2">
                        <Link href={`/products/${item.product._id}`}>
                          {item.product.images &&
                            item.product.images.length > 0 && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={150}
                                height={150}
                                className="rounded object-cover"
                              />
                            )}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        <Link href={`/products/${item.product._id}`}>
                          {item.product.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2">
                        ${(item.product.price || 0).toFixed(2)}
                      </td>
                      <td className="flex h-24 items-center px-4 py-2">
                        <button
                          onClick={() => DecreaseProductAmount(item)}
                          className="bg-gray-200 rounded px-2 py-1"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.amount}</span>
                        <button
                          onClick={() => IncreaseProductAmount(item)}
                          className="bg-gray-200 rounded px-2 py-1"
                        >
                          +
                        </button>
                      </td>
                      <td className="px-4 py-2">${itemTotal.toFixed(2)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-2">
                    Your cart is empty.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="w-full rounded-lg border p-6 md:w-1/3">
          <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
          <div className="mb-2 flex justify-between">
            <span>Subtotal</span>
            <span>${(subTotalPrice || 0).toFixed(2)}</span>
          </div>
          <div className="mb-2 flex justify-between">
            <span>Shipment Fees</span>
            <span>${(shipmentFees || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray pt-4 text-lg font-bold">
            <span>Total</span>
            <span>${(totalPrice || 0).toFixed(2)}</span>
          </div>
          <button className="mt-6 w-full rounded-full bg-black py-2 text-white transition hover:border hover:border-black hover:bg-white hover:text-black">
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
