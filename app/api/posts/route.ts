import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prismadb";
import { NextResponse } from "next/server";
import { withCache, invalidatePattern } from "@/lib/redis-cache";
import { pusherServer } from "@/lib/pusher"; // Import pusherServer

// ⚡ Force Node.js runtime for Prisma compatibility
export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await auth(); // Obtiene la sesión del usuario
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Not authenticated", status: "error" }, { status: 401 });
    }

    const userId = +session?.user?.id; // Convierte el id del usuario a número
    const requestBody = await request.json(); // Obtiene los datos de la solicitud
    const { body, postImage, postVideo, postGif } = requestBody; // Extrae los valores

    if (!body) {
      return NextResponse.json(
        { message: "Post content required", status: "error" },
        { status: 400 }
      );
    }

    // Crear el post y guardar la URL del GIF
    const post = await prisma.post.create({
      data: {
        body: body, // Cuerpo del post
        postImage: postImage, // Imagen del post (si aplica)
        postVideo: postVideo, // Video del post (si aplica)
        postGif: postGif, // GIF del post (si aplica)
        userId: userId, // Id del usuario que creó el post
      },
      include: {
        // Include user information to send in Pusher event
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
            subscription: {
              select: {
                plan: true,
              },
            },
          },
        },
      },
    });

    // ⚡ Trigger Pusher event
    await pusherServer.trigger("posts", "new-post", post);

    // ⚡ Invalidar cache de posts
    await invalidatePattern("posts:");

    return NextResponse.json(
      {
        data: post,
        message: "Post created successfully",
        status: "success",
      },
      { status: 201 }
    );
  } catch {
    console.error("Error al crear el post:");
    return NextResponse.json(
      {
        message: "Failed to create post",
        status: "error",
      },
      { status: 400 }
    );
  }
}
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    const userId = searchParams.get("userId");

    // ⚡ Paginación
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // ⚡ Query optimizada
    const where = userId ? { userId: +userId } : {};

    // ⚡ Cache key único por query
    const cacheKey = `posts:${userId || "all"}:page${page}:limit${limit}`;

    // ⚡ Usar cache (60 segundos)
    const posts = await withCache(
      cacheKey,
      async () => {
        const t0 = Date.now();
        const result = await prisma.post.findMany({
          where,
          take: limit, // ⚡ Límite de posts
          skip, // ⚡ Paginación
          select: {
            id: true,
            body: true,
            postImage: true,
            postVideo: true,
            postGif: true,
            createdAt: true,
            updatedAt: true,
            likeIds: true,
            userId: true,
            // ⚡ Solo campos necesarios del usuario
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profileImage: true,
                subscription: {
                  select: {
                    plan: true,
                  },
                },
              },
            },
            // ⚡ Solo contar comentarios, no cargarlos todos
            _count: {
              select: {
                comments: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        const t1 = Date.now();
        console.log(`⚡ Prisma query time: ${t1 - t0}ms (rows: ${result.length})`);
        return result;
      },
      180 // Cache por 3 minutos - posts nuevos no son urgentes
    );

    return NextResponse.json({
      status: "success",
      posts,
      pagination: {
        page,
        limit,
        hasMore: posts.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      {
        message: "Failed to retrieve data",
        status: "error",
      },
      { status: 400 }
    );
  }
}
