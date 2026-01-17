"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export const MobileUserDropdown = ({
  username,
  name,
  profileImage,
  onLogout,
}: MobileUserDropdownProps) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="w- flex cursor-pointer items-center gap-3 rounded-lg p-8 transition hover:bg-gray-100 dark:hover:bg-gray-800">
          <Avatar className="h-10 w-10">
            <AvatarImage src={profileImage} alt={username} />
            <AvatarFallback>{name?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold dark:text-white">{name}</p>
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
