import { auth } from "@/lib/auth";
import { withRetry } from "@/lib/prisma-retry";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";

// ⚡ Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }

    // ⚡ Usar withRetry para manejar errores de conexión
    const currentUser = await withRetry(() =>
      prisma.user.findUnique({
        where: {
          email: session.user.email!,
        },
        select: {
          id: true,
          name: true,
          username: true,
          bio: true,
          email: true,
          dateOfBirth: true,
          emailVerified: true,
          coverImage: true,
          profileImage: true,
          createdAt: true,
          updatedAt: true,
          followingIds: true,
          hasNotification: true,
          isVerifed: true,
          subscription: {
            select: {
              plan: true,
            },
          },
        },
      })
    );

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found", status: "error" },
        { status: 400 }
      );
    }
    return NextResponse.json({ currentUser });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
