import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/userModel";

// Handle GET requests
export async function GET() {
  await dbConnect();

  try {
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users });
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
    const user = await User.create(body);
    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      // Handle duplicate key error specifically
      if (error.message.includes("E11000 duplicate key error")) {
        return NextResponse.json(
          { success: false, error: "A user with this email already exists." },
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
