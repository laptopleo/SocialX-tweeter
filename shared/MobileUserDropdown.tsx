"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface MobileUserDropdownProps {
  username: string;
  name: string;
  profileImage?: string;
  onLogout?: () => void;
}

export const MobileUserDropdown = ({ username, name, profileImage, onLogout }: MobileUserDropdownProps) => {
  const router = useRouter();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex items-center gap-3 p-8 w- rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
          <Avatar className="w-10 h-10">
            <AvatarImage src={profileImage} alt={username} />
            <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden md:block text-left">
            <p className="font-semibold text-sm dark:text-white">{name}</p>
            <p className="text-xs text-gray-500">@{username}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuItem onClick={() => router.push(`/${username}`)}>
          <User className="mr-2 h-4 w-4" />
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};