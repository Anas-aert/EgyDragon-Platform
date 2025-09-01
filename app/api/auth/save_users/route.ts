import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import userSchema from "../../users/schema"; // نفس اللي عندك

export async function POST() {
  // هات الـ session
  const session = await getServerSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // البيانات من session
  const { name, email, image } = session.user;

  // Validate
  const userValidation = userSchema.safeParse({ name, email, image });

  if (!userValidation.success) {
    return NextResponse.json(
      { errors: userValidation.error.issues.map((e) => e.message) },
      { status: 400 }
    );
  }

  // Save user in DB
  const newUser = await prisma.user.create({
    data: userValidation.data,
  });

  return NextResponse.json(newUser, { status: 201 });
}
