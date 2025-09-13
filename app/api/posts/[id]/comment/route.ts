import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";


// 🔹 Get Comments
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: { postId: params.id },
      include: { user: true }, // يجيب بيانات الشخص اللي كتب التعليق
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}


// 🔹 Add Comment
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, content } = await req.json();

    if (!userId || !content) {
      return NextResponse.json(
        { error: "User ID and content required" },
        { status: 400 }
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        userId,
        content,
      },
      include: { user: true }, // يجيب مع التعليق بيانات اليوزر
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

