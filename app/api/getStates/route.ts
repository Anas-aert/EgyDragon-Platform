import prisma from "@/prisma/client";
import { NextResponse } from "next/server";

// 🟢 GET => يرجّع حالة المستخدم (isOnline + lastSeen)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isOnline: true, lastSeen: true },
    });


    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ✏️ PUT => يحدّث حالة المستخدم (isOnline + lastSeen)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, isOnline } = body;

    if (!userId || typeof isOnline !== "boolean") {
      return NextResponse.json(
        { error: "userId and isOnline(boolean) are required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline,
        lastSeen: new Date(),
      },
      select: { id: true, isOnline: true, lastSeen: true },
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
