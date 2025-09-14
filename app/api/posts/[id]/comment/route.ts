import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { postId, userId, content } = await request.json();

    if (!postId)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    if (!userId || !content)
      return NextResponse.json(
        { error: "User ID and content required" },
        { status: 400 }
      );

    const comment = await prisma.comment.create({
      data: { postId, userId, content },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        createdAt: comment.createdAt.toISOString(),
        user: comment.user, // ✅ هنا بيتضمن الـ {id, name, image}
      },
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const postId = request.nextUrl.searchParams.get("postId");

    if (!postId)
      return NextResponse.json({ error: "Post ID not found" }, { status: 400 });

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, image: true } } },
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
