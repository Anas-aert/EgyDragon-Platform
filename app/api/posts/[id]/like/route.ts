import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// 🔹 Get Likes Count + List of users
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const likes = await prisma.like.findMany({
      where: { postId: resolvedParams.id },
      include: { user: true },
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

// ✅ Toggle Like
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    const existing = await prisma.like.findFirst({
      where: { postId: resolvedParams.id, userId },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, liked: false });
    }

    await prisma.like.create({
      data: { postId: resolvedParams.id, userId },
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