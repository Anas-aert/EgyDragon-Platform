// app/api/posts/[id]/like/route.ts
import { authOptions } from "@/app/lib/nextAuth";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(
  req: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" }, 
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const postId = params.id;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "Post ID is required" }, 
        { status: 400 }
      );
    }

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" }, 
        { status: 404 }
      );
    }

    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: { 
        postId_userId: { postId, userId } 
      },
    });

    let liked: boolean;

    if (existingLike) {
      // Unlike the post
      await prisma.like.delete({ 
        where: { id: existingLike.id } 
      });
      liked = false;
    } else {
      // Like the post
      await prisma.like.create({ 
        data: { postId, userId } 
      });
      liked = true;
    }

    // Get updated likes count
    const likesCount = await prisma.like.count({
      where: { postId }
    });

    return NextResponse.json({ 
      success: true, 
      liked,
      likesCount 
    });

  } catch (error) {
    console.error("Like API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
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

    const likes = await prisma.like.findMany({
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
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ 
      success: true, 
      likes,
      count: likes.length 
    });

  } catch (error) {
    console.error("Get Likes API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}