import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserX, Home } from "lucide-react";

/**
 * ⚡ Página 404 personalizada para perfiles no encontrados
 */
export default function UserNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-muted">
            <UserX className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">User Not Found</h1>
          <p className="text-muted-foreground">
            This account does not exist or has been deleted.
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
          <Button asChild variant="outline">
            <Link href="/search">
              Search Users
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
