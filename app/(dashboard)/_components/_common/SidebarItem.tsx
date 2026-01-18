"use client";

import React, { useCallback } from "react";
import { BadgeCheckIcon, Dot, Ellipsis, LucideIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { useStore } from "@/hooks/useStore";
import cn from "classnames";

interface PropsType {
  label?: string;
  href?: string;
  icon?: LucideIcon;
  isUser?: boolean;
  alert?: boolean;
  userInfo?: {
    profileImgUrl: string;
    username: string;
    name: string;
  };
  onClick?: () => void;
}

const SidebarItem: React.FC<PropsType> = ({
  userInfo = null,
  isUser = false,
  label,
  icon: Icon,
  onClick,
  href,
  alert,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpenProModal } = useStore();

  const handleClick = useCallback(() => {
    if (onClick) onClick();
    if (href && href !== "#premium") {
      router.push(href);
    }
  }, [router, onClick, href]);

  const handleOpenModal = useCallback(() => {
    if (href === "#premium") {
      onOpenProModal();
    }
  }, [href, onOpenProModal]);

  // Determina si la ruta actual coincide con el href
  const activePath = href ? pathname === href : false;
  const renderIcon = () => {
    if (label === "Grok") {
      // Usar Logo en vez del ícono asignado originalmente para Grok.
      return (
        <Logo size={24} className="text-[#14171A] group-hover:text-indigo-900 dark:text-white" />
      );
    } else if (label === "Premium") {
      // Usar BadgeCheckIcon en vez de Logo para Premium.
      return (
        <BadgeCheckIcon
          size={24}
          className="text-[#14171A] group-hover:text-indigo-900 dark:text-white"
        />
      );
    } else {
      return Icon ? <Icon size={24} /> : null;
    }
  };

  return (
    <a
      onClick={href === "#premium" ? handleOpenModal : handleClick}
      className={cn(
        "group mt-4 flex cursor-pointer items-center rounded-lg transition-all duration-100 md:w-44 lg:p-2",
        "hover:dark:bg-black hover:dark:shadow-sm md:border md:border-transparent md:hover:dark:border-primary",
        activePath ? "bg-primary/10" : "dark:text-white hover:dark:text-indigo-900"
      )}>
      {/* Versión móvil: se oculta en pantallas grandes */}
      <div className="flex items-center justify-center p-1 lg:hidden">
        {isUser && userInfo ? (
          <Avatar className="h-14 w-14">
            <AvatarImage src={userInfo.profileImgUrl} className="object-cover" />
            <AvatarFallback className="text-[18px] font-bold">{userInfo.name[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <>
            {/* Para móviles: si es Premium se muestra Logo, pero aquí lo cambiamos mediante renderIcon */}
            {renderIcon()}
            {alert && <Dot size={70} className="absolute -top-4 left-0 text-primary" />}
          </>
        )}
      </div>

      {/* Versión mobile*/}
      <div className="relative hidden w-full items-center gap-4 lg:flex" onClick={handleOpenModal}>
        {isUser && userInfo ? (
          <div className="flex w-full justify-between gap-2">
            <div className="flex-1 text-left">
              <h3 className="block max-w-[150px] truncate text-[16px] font-medium leading-tight text-[#14171A] dark:text-white">
                {userInfo.name}
              </h3>
              <p className="block max-w-[120px] truncate text-[15px] font-medium !text-[#959fa8]">
                @{userInfo.username}
              </p>
            </div>
            <div className="flex shrink-0 justify-end">
              <Ellipsis />
            </div>
          </div>
        ) : (
          <>
            {/* Para escritorio: aplicamos la misma lógica */}
            {renderIcon()}
            <span className="hidden text-xl font-medium text-[#14171A] dark:text-white lg:block">
              {label}
            </span>
            {alert && <Dot size={70} className="absolute -left-4 -top-8 text-primary" />}
          </>
        )}
      </div>
    </a>
  );
};

export default SidebarItem;
