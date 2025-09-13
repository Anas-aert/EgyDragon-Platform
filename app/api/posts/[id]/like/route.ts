import { prisma } from "@/prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Check if already liked
    const existing = await prisma.like.findFirst({
      where: { postId: params.id, userId },
    });

    if (existing) {
      // If liked → remove (toggle like)
      await prisma.like.delete({ where: { id: existing.id } });
      return NextResponse.json({ success: true, liked: false });
    }

    // Add new like
    await prisma.like.create({
      data: { postId: params.id, userId },
    });

    return NextResponse.json({ success: true, liked: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}
