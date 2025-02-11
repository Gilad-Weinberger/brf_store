import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import CartProduct from "@/lib/models/cartProductModel";

// Handle DELETE requests to delete a specific topic
export async function DELETE(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    // Find the topic by ID
    const cartProduct = await CartProduct.findById(id);

    if (!cartProduct) {
      return NextResponse.json(
        { success: false, error: `CartProduct with id '${id}' doesn't exist` },
        { status: 404 },
      );
    }

    // Delete the topic by ID
    await CartProduct.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: `CartProduct named ${cartProduct.name} deleted successfully`,
    });
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
