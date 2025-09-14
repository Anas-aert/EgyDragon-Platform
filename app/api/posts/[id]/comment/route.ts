// app/api/posts/[id]/comment/route.ts
import { authOptions } from "@/app/lib/nextAuth";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "You should be signed in" },
        { status: 401 }
      );
    }

    const { content } = await req.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, message: "Comment content is required" },
        { status: 400 }
      );
    }

    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { success: false, message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Post not found" },
        { status: 404 }
      );
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: postId,
        userId: session.user.id,
      },
      include: {
        user: {
          select: { 
            id: true, 
            name: true, 
            image: true 
          },
        },
      },
    });

    // Convert createdAt to ISO string
    const commentWithDateString = {
      ...comment,
      createdAt: comment.createdAt.toISOString(),
    };

    return NextResponse.json({ 
      success: true, 
      comment: commentWithDateString 
    });

  } catch (error) {
    console.error("Comment API Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" }, 
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { 
        user: { 
          select: { 
            id: true, 
            name: true, 
            image: true 
          } 
        } 
      },
      orderBy: { createdAt: "asc" },
    });

    // Convert dates to ISO strings
    const commentsWithDateStrings = comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      comments: commentsWithDateStrings,
      count: comments.length
    });

  } catch (error) {
    console.error("Get Comments API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" }, 
      { status: 500 }
    );
  }
}