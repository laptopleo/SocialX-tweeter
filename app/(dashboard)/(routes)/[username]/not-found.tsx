import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX, Home } from "lucide-react";

/**
 * ⚡ Página 404 personalizada para perfiles no encontrados
 */
export default function UserNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-muted rounded-full p-4">
            <UserX className="text-muted-foreground h-12 w-12" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">This account does not exist or has been deleted.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link href="/home">
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/search">Search Users</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
