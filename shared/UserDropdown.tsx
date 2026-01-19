// components/UserDropdown.tsx
"use client";

import { signOut } from "next-auth/react"; // o tu lógica de logout
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Ellipsis, LogOut, User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface UserDropdownProps {
  username: string;
  name: string;
  profileImage?: string;
  onLogout?: () => void;
}

export const UserDropdown = ({ username, name, profileImage, onLogout }: UserDropdownProps) => {
  const router = useRouter();
  return (
    <div className="w-full">
      {/* Desktop: pill estilo como imagen */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* ✅ Convierte TODO el botón en el trigger */}
          <Button className="focus-none mt-6 flex w-full items-center justify-center border bg-black/10 px-4 py-8 hover:bg-gray-800">
            {/* Info del usuario (ocupa el espacio disponible) */}
            <div className="flex flex-1 items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profileImage} alt={username} />
                <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{name}</p>
                <p className="text-xs text-gray-500">@{username}</p>
              </div>
            </div>

            {/* Ícono decorativo (ya no es un botón) */}
            <Ellipsis className="h-5 w-5 text-gray-700 dark:text-white" />
          </Button>
        </DropdownMenuTrigger>

        {/* Contenido del menú */}
        <DropdownMenuContent className="bg-secondary w-56" align="end">
          <DropdownMenuItem
            className="dark:hover:border-primary cursor-pointer border"
            onClick={() => router.push(`/${username}`)}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
