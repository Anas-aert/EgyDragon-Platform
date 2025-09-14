import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/nextAuth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const postId = url.pathname.split("/")[6];
    console.log(postId)

    if (!postId)
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      comments: comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
      })),
      count: comments.length,
    });
  } catch (error) {
    console.error("Get Comments API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "You should be signed in" },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const postId = url.pathname.split("/")[6];
    console.log(postId)

    if (!postId)
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );

    const { content } = await request.json();
    if (!content?.trim())
      return NextResponse.json(
        { success: false, message: "Comment content is required" },
        { status: 400 }
      );

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post)
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );

    const comment = await prisma.comment.create({
      data: { content: content.trim(), postId, userId: session.user.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    return NextResponse.json({
      success: true,
      comment: { ...comment, createdAt: comment.createdAt.toISOString() },
    });
  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
