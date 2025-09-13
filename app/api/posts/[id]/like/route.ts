import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId } = await request.json();

    if (!postId)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    if (!userId)
      return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const existingLike = await prisma.like.findUnique({
      where: { userId_postId: { userId, postId } },
    });

    let liked;
    if (existingLike) {
      await prisma.like.delete({ where: { userId_postId: { userId, postId } } });
      liked = false;
    } else {
      await prisma.like.create({ data: { userId, postId } });
      liked = true;
    }

    const likesCount = await prisma.like.count({ where: { postId } });

    return NextResponse.json({ success: true, liked, likesCount });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(likes);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch likes" }, { status: 500 });
  }
}

