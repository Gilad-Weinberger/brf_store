import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/userModel";

// Handle GET requests to fetch a specific user by ID
export async function GET(req, { params }) {
  await dbConnect();

  try {
    const { id } = params;

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: user });
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
