import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { withCache } from "@/lib/redis-cache";

// ⚡ Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Not authenticated", status: "error" },
        { status: 401 }
      );
    }

    const currentUserId = +session.user.id;

    // ⚡ Usar cache (120 segundos - los usuarios cambian poco)
    const users = await withCache(
      `users:list:exclude${currentUserId}`,
      async () => {
        const t0 = Date.now();
        const result = await prisma.user.findMany({
          where: {
            id: {
              not: currentUserId,
            },
          },
          take: 20, // ⚡ Límite
          orderBy: {
            createdAt: "desc",
          },
          select: {
            id: true,
            name: true,
            username: true,
            bio: true,
            profileImage: true,
            followingIds: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        });
        const t1 = Date.now();
        console.log(
          `⚡ Prisma query time: ${t1 - t0}ms (rows: ${result.length})`
        );
        return result;
      },
      300 // Cache por 5 minutos - usuarios cambian poco
    );

    return NextResponse.json({
      message: "Users retrieved successfully",
      status: "success",
      data: users,
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
