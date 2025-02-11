import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/lib/models/productModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const products = await Product.find({}).populate("brand", "name logo");
    return NextResponse.json({ success: true, data: products });
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
    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // Handle duplicate key error specifically
      if (error.message.includes("E11000 duplicate key error")) {
        return NextResponse.json(
          {
            success: false,
            error: "A product with this email already exists.",
          },
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
