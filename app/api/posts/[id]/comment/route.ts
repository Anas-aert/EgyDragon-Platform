import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { userId, content } = await req.json();

    if (!userId || !content) {
      return NextResponse.json({ error: "User ID and content required" }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: params.id,
        userId,
        content,
      },
    });

    return NextResponse.json({ success: true, comment });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
