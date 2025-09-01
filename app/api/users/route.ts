
import { NextRequest, NextResponse } from "next/server";
import userSchema from "./schema";
import { prisma } from "@/prisma/client";

// ✅ GET all users
export async function GET() {
  const users = await prisma.user.findMany({
    include: { posts: true }, // لو حابب تجيب البوستات مع المستخدم
  });

  if (!users || users.length === 0) {
    return NextResponse.json(
      { "Empty Page😢": "No users found" },
      { status: 404 }
    );
  }

  return NextResponse.json(users, { status: 200 });
}

// ✅ POST new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate
    const userValidation = userSchema.safeParse(body);

    if (!userValidation.success) {
      return NextResponse.json(
        { errors: userValidation.error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }

    // Save in DB
    const newUser = await prisma.user.create({
      data: userValidation.data,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error },
      { status: 500 }
    );
  }
}
