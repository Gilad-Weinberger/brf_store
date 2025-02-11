"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { AddProductToCart } from "@/lib/ChangeCartFunctions";

export default function Product({ id, user }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userCart, setUserCart] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        const filteredProduct = data.data.find((p) => p._id === id);
        if (filteredProduct) {
          setProduct(filteredProduct);
          setMainImage(filteredProduct.images[0] || "");
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!product?.images) return;

      if (event.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % product.images.length;
        setMainImage(product.images[nextIndex]);
        setCurrentIndex(nextIndex);
      } else if (event.key === "ArrowLeft") {
        const prevIndex =
          (currentIndex - 1 + product.images.length) % product.images.length;
        setMainImage(product.images[prevIndex]);
        setCurrentIndex(prevIndex);
      }
    },
    [currentIndex, product],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!product) return <p>No product found</p>;

  const colorOptions = product?.colors || [];
  const sizeOptions = product?.sizes || [];
  const images = product?.images || [];

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleImageClick = (clickedImage) => {
    setMainImage(clickedImage);
    setCurrentIndex(product?.images.indexOf(clickedImage) || 0);
  };

  return (
    <div className="flex flex-col justify-between md:flex-row md:px-32">
      <div className="mb-6 md:mb-0 md:w-1/2">
        <Image
          src={mainImage}
          alt="Main Product Image"
          width={500}
          height={500}
          className="h-[490px] w-[490px] rounded-2xl object-cover"
        />
        <div className="mt-5 flex items-center gap-2.5">
          {images.slice(0, 4).map((image, index) => (
            <Image
              key={index}
              src={image}
              alt={`Thumbnail ${index}`}
              width={100}
              height={100}
              className={`h-[90px] w-[90px] cursor-pointer rounded-[10px] object-cover ${
                image === mainImage ? "outline outline-2 outline-black" : ""
              }`}
              onClick={() => handleImageClick(image)}
            />
          ))}
          {images.length > 4 && (
            <div className="flex h-[90px] w-[90px] items-center justify-center rounded-[10px] outline outline-2 outline-black">
              <p className="text-[14px]">+{images.length - 4} more</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-between md:w-[40%]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src={product.brand?.logo || `/adidas.jpg`}
              alt={`product logo`}
              width={30}
              height={30}
            />
            <p className="font-medium">
              {product.brand?.name || "Default Brand"}
            </p>
          </div>
          <p className="text-[14px] text-light_gray">{id}</p>
        </div>
        <p className="text-[25px] font-semibold">{product.name}</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="rating rating-sm">
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
              defaultChecked
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
            <input
              type="radio"
              name="rating-2"
              className="mask mask-star-2 bg-orange-400"
            />
          </div>
          <p className="h-[15px] text-[13px] text-gray">100 Reviews</p>
        </div>
        <p className="my-6 text-[40px] font-medium">${product.price}</p>
        <form>
          <div className="mb-4">
            <p className="font-medium">Color</p>
            <div className="mt-2 flex gap-2">
              {colorOptions.map((color) => (
                <div
                  key={color}
                  style={{ backgroundColor: color }}
                  className={`h-8 w-8 cursor-pointer rounded-full border ${
                    selectedColor === color
                      ? color === "black"
                        ? "border-2 border-red-500"
                        : "border-2 border-black"
                      : "border-gray"
                  }`}
                  onClick={() => setSelectedColor(color)}
                ></div>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium">Size</p>
            <div className="mt-2 grid grid-flow-row grid-cols-6 gap-2 max-lg:grid-cols-4 max-md:grid-cols-6 max-sm:grid-cols-4">
              {sizeOptions.map((size) => (
                <div
                  key={size}
                  className={`flex h-10 w-[70px] cursor-pointer items-center justify-center border ${
                    selectedSize === size ? "bg-black text-white" : ""
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                AddProductToCart(user, product, selectedColor, selectedSize)
              }
              className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-black py-2 text-white md:w-[calc(100%-58px)]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="#ffffff"
                className="bi bi-bag"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z" />
              </svg>
              Add to Cart
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={`flex h-12 w-12 items-center justify-center rounded-md border-2 border-black`}
            >
              <Image
                src={`/heart-${isLiked}.svg`}
                alt="heart"
                width={isLiked ? 30 : 24}
                height={isLiked ? 30 : 24}
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
