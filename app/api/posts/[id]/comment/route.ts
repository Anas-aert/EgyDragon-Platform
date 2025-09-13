import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ Add Comment
export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[4]; // posts/[id]/comment → index 4

    if (!id)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const { userId, content } = await request.json();
    if (!userId || !content)
      return NextResponse.json(
        { error: "User ID and content required" },
        { status: 400 }
      );

    const comment = await prisma.comment.create({
      data: { postId: id, userId, content },
      include: { user: true },
    });

    return NextResponse.json({
      success: true,
      comment: { ...comment, createdAt: comment.createdAt.toISOString() },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// ✅ Get Comments
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split("/")[4];

    if (!id)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { postId: id },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(
      comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
