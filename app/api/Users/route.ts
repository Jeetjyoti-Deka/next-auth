import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userData = body.formData;

    if (!userData.email || !userData.password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // check for duplicate emails
    const duplicate = await User.findOne({ email: userData.email });

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate email" }, { status: 409 });
    }

    const hashPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashPassword;

    await User.create(userData);
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
