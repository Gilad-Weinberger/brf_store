"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error("Products not found");
        }
        const data = await response.json();

        // Sort products by soldCount (highest first)
        const sortedProducts = data.data.sort((a, b) => b.sold - a.sold);

        setProducts(sortedProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="mt-5 text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!products.length) return <p className="text-center">No products found</p>;

  return (
    <div className="mt-2 grid w-full grid-cols-1 gap-4 px-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <div
          key={product._id}
          className="mx-auto h-[250px] w-full max-w-[250px] rounded-lg bg-light_gray shadow-md"
        >
          <Link
            className="flex h-full w-full flex-col items-center justify-center p-3"
            href={`/products/${product._id}`}
          >
            <Image
              src={product.images[0] || "/messi.webp"}
              alt={product.name}
              width={200}
              height={200}
              className="w-full object-cover"
            />
            <p className="mt-2 text-center text-[15px] font-medium">
              {product.name}
            </p>
            <p className="mt-1 text-center text-[17px] font-semibold">
              ${product.price}
            </p>
          </Link>
        </div>
      ))}
    </div>
  );
}
