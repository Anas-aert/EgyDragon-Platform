import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import schema from "./schema";

type RouteContext = {
  params: { id: string };
};

export async function GET(req: NextRequest, context: RouteContext) {
  const { params } = context;

  const idCheck = schema.safeParse({ id: params.id });

  if (!idCheck.success) {
    return NextResponse.json({ error: idCheck.error.message }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: idCheck.data.id },
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
