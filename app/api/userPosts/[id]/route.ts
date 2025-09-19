import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import schema from "./schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const param = params;

  const id = schema.safeParse(param);

  if (!id.success) {
    return NextResponse.json({ error: id.error.message }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: id.data.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      likes: {
        select: {
          id: true,
          userId: true,
          user: { select: { name: true, image: true } },
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          userId: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts, { status: 200 });
}
