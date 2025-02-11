"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const CartButton = ({ user }) => {
  const [cartLength, setCartLength] = useState(0);

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const res = await fetch(`/api/carts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch carts");

        const userCart = data.data.filter((cart) => cart.user._id === user._id);
        setCartLength(userCart[0].products.length || 0);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <Link href="/cart">
      <button className="relative">
        {cartLength > 0 && (
          <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow text-[11px] font-bold text-black">
            {cartLength}
          </span>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="currentColor"
          className="bi bi-bag"
          viewBox="0 0 16 16"
        >
          <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
        </svg>
      </button>
    </Link>
  );
};

export default CartButton;
