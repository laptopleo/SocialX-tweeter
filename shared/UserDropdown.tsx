// components/UserDropdown.tsx
"use client";

import { signOut } from "next-auth/react"; // o tu lógica de logout
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  <div className="w-full ">
    {/* Desktop: pill estilo como imagen */}
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* ✅ Convierte TODO el botón en el trigger */}
        <Button
          className="
            mt-6 px-4 py-8 flex justify-center items-center w-full border bg-black/10 hover:bg-gray-800
          focus-none"
        >
          {/* Info del usuario (ocupa el espacio disponible) */}
          <div className="flex items-center gap-3 flex-1">
            <Avatar className="w-10 h-10">
              <AvatarImage src={profileImage} alt={username} />
              <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {name}
              </p>
              <p className="text-xs text-gray-500">@{username}</p>
            </div>
          </div>

          {/* Ícono decorativo (ya no es un botón) */}
          <Ellipsis className="h-5 w-5 text-gray-700 dark:text-white" />
        </Button>
      </DropdownMenuTrigger>

      {/* Contenido del menú */}
      <DropdownMenuContent className="w-56 bg-secondary" align="end">
        <DropdownMenuItem 
          className="cursor-pointer border dark:hover:border-primary" 
          onClick={() => router.push(`/${username}`)}
        >
          <User className="h-4 w-4 mr-2" />
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