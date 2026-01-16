"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileX, Home, ArrowLeft } from "lucide-react";

/**
 * ⚡ Página 404 personalizada para posts no encontrados
 */
export default function PostNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <FileX className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">
            This post doesn't exist, has been deleted, or you don't have permission to view it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="default">
            <Link href="/home">
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <span className="cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
