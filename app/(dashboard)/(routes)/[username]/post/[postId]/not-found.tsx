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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-4">
            <FileX className="text-muted-foreground h-12 w-12" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Post Not Found</h1>
          <p className="text-muted-foreground">
            This post does not exist, has been deleted, or you do not have permission to view it.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link href="/home">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" onClick={() => window.history.back()}>
            <span className="cursor-pointer">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
