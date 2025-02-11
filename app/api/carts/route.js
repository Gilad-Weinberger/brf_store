import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Cart from "@/lib/models/cartModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const carts = await Cart.find({})
      .populate("user", "_id name email image")
      .populate({
        path: "products",
        populate: { path: "product", select: "_id name images price" },
      });
    return NextResponse.json({ success: true, data: carts });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 400 },
    );
  }
}

// Handle POST requests
export async function POST(req) {
  await dbConnect();

  try {
    const body = await req.json();
    const cart = await Cart.create(body);
    return NextResponse.json({ success: true, data: cart }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // Handle duplicate key error specifically
      if (error.message.includes("E11000 duplicate key error")) {
        return NextResponse.json(
          { success: false, error: "A cart with this email already exists." },
          { status: 400 },
        );
      }

      // Handle other errors
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 400 },
    );
  }
}
