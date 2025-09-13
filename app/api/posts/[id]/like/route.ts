import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";



// 🔹 Get Likes Count + List of users
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const likes = await prisma.like.findMany({
      where: { postId: params.id },
      include: { user: true }, // assuming Like has relation → user
    });

    return NextResponse.json({
      count: likes.length,
      users: likes.map((like) => like.user),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}


// 🔹 Toggle Like
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: { postId: params.id, userId },
    });

    if (existing) {
      // Remove like
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, liked: false });
    }

    // Add like
    await prisma.like.create({
      data: { postId: params.id, userId },
    });

    return NextResponse.json({ success: true, liked: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}

