import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { rateLimit, getIdentifier, RATE_LIMITS } from "@/lib/rate-limit";

// ⚡ Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

export async function PATCH(request: Request) {
  try {
    // ⚡ Rate limiting
    const identifier = getIdentifier(request);
    const { success } = await rateLimit(identifier, RATE_LIMITS.WRITE);

    if (!success) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later.", status: "error" },
        { status: 429 }
      );
    }

    // ✅ Autenticación
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated", status: "error" }, { status: 401 });
    }

    const { userId, name, username, bio, profileImage, coverImage } = await request.json();

    if (!name || !username) {
      return NextResponse.json(
        { message: "Missing Field: name,username", status: "error" },
        { status: 400 }
      );
    }

    const sessionUserId = +session.user.id;

    // ✅ Autorización: Verificar que el usuario solo edite su propio perfil
    if (userId && userId !== sessionUserId) {
      return NextResponse.json(
        { message: "Unauthorized: Cannot edit other users", status: "error" },
        { status: 403 }
      );
    }

    // ✅ Verificar que el username no esté tomado por otro usuario
    if (username !== session.user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser && existingUser.id !== sessionUserId) {
        return NextResponse.json(
          { message: "Username already taken", status: "error" },
          { status: 409 }
        );
      }
    }

    await prisma.user.update({
      where: {
        id: sessionUserId,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return NextResponse.json(
      {
        message: "Update user successfully",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        status: "error",
      },
      { status: 500 }
    );
  }
}
