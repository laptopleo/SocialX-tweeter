import { auth } from "@/lib/auth";
import { withRetry } from "@/lib/prisma-retry";
import { prisma } from "@/lib/prismadb";
// ⚡ 1. Importa tu sistema de caché CORRECTO (el primer archivo)
import { withCache } from "@/lib/cache"; // <-- Usa ESTE helper
import { NextResponse } from "next/server";

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

    // ⚡ 2. Define una clave de caché única y descriptiva
    const cacheKey = `user:current:${session.user.email}`;

    // ⚡ 3. Usa la función 'withCache' para envolver toda la lógica
    const currentUser = await withCache(cacheKey, async () => {
      // Esta función solo se ejecuta si hay un Cache MISS
      return await withRetry(() =>
        prisma.user.findUnique({
          where: { email: session.user.email! },
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
            subscription: { select: { plan: true } },
          },
        })
      );
    }, 30); // ⚡ 4. TTL de 30 segundos (ajusta si quieres)

    if (!currentUser) {
      return NextResponse.json(
        { message: "User not found", status: "error" },
        { status: 400 }
      );
    }

    return NextResponse.json({ currentUser });
  } catch (error) {
    console.error('Error en /api/current-user:', error);
    return NextResponse.json(
      { message: "Failed to retrieve data", status: "error" },
      { status: 400 }
    );
  }
}