import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(request: Request, context: { params: Promise<{ username: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated", status: "error" }, { status: 401 });
    }

    const { username } = await context.params;
    if (!username) {
      return NextResponse.json(
        { message: "Username must be provided", status: "error" },
        { status: 400 }
      );
    }

    const isOwner = session.user.username === username;

    const baseSelect = {
      id: true,
      name: true,
      username: true,
      bio: true,
      coverImage: true,
      profileImage: true,
      createdAt: true,
      updatedAt: true,
      followingIds: true,
      hasNotification: true,
      subscription: {
        select: {
          plan: true,
        },
      },
    } as const;

    const ownerSelect = {
      ...baseSelect,
      email: true,
      dateOfBirth: true,
      emailVerified: true,
    } as const;

    const existingUser = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: isOwner ? ownerSelect : baseSelect,
    });
    if (!existingUser) {
      return NextResponse.json({ message: "User not found", status: "error" }, { status: 404 });
    }

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: existingUser.id,
        },
      },
    });

    return NextResponse.json({
      message: "User retrieved successfully",
      status: "success",
      data: { ...existingUser, followersCount },
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        status: "error",
      },
      { status: 500 }
    );
  }
}
