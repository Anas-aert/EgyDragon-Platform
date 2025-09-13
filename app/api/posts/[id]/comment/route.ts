import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ Add Comment
export async function POST(request: NextRequest) {
  try {

    const { id, userId, content } = await request.json();

    if (!id)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

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
    const body = await request.json();

    if (!body.id)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { postId: body.id },
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
