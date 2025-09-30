// app/api/auth/saveusers/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";
import { NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import userSchema from "../../users/schema";


export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email, image } = session.user;

  // Validate
  const userValidation = userSchema.safeParse({ name, email, image });

  if (!userValidation.success) {
    return NextResponse.json(
      { errors: userValidation.error.issues.map((e) => e.message) },
      { status: 400 }
    );
  }

  // Save user in DB (use upsert to avoid duplicates)
  const newUser = await prisma.user.upsert({
    where: { email: userValidation.data.email },
    update: {},
    create: userValidation.data,
  });

  return NextResponse.json(newUser, { status: 201 });
}
