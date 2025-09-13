import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

// ✅ Add Comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { userId, content } = await request.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: "User ID and content required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: resolvedParams.id,
        userId,
        content,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}

// ✅ Get Comments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const comments = await prisma.comment.findMany({
      where: { postId: resolvedParams.id },
      include: { user: true },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}