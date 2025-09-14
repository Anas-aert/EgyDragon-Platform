import { authOptions } from "@/app/lib/nextAuth";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = session.user.id;
    const postId = params.id;

    const existing = await prisma.like.findUnique({
      where: { postId_userId: { postId, userId } },
    });

    let liked: boolean;
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      liked = false;
    } else {
      await prisma.like.create({ data: { postId, userId } });
      liked = true;
    }

    return NextResponse.json({ success: true, liked });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const postId = new URL(request.url).searchParams.get("postId");
    if (!postId)
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });

    const likes = await prisma.like.findMany({
      where: { postId },
      include: { user: { select: { name: true, image: true } } },
    });

    return NextResponse.json(likes);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}
