import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";

/**
 * Health Check Endpoint
 * Usado por Docker healthcheck y monitoring
 */
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: "connected",
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    );
  }
}
