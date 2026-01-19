"use client";
import Logo from "@/components/logo";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  Bell,
  Feather,
  Home,
  LucideIcon,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SidebarItem from "./_common/SidebarItem";

import { useCurrentUserContext } from "@/context/currentuser-provider";
import { doLogout } from "../../actions/auth.action";
import PostFormModal from "./_common/PostFormModal";
import { UserDropdown } from "@/shared/UserDropdown";
import { UserType } from "@/types/user.type";

interface MenuType {
  label: string;
  href?: string;
  icon?: LucideIcon;
  alert?: boolean;
}

const Sidebar = (props: { isPro: boolean }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isPro } = props;

  const router = useRouter();
  const { data, isLoading } = useCurrentUserContext();
  const fetchedUser: UserType = data?.currentUser ?? ({} as UserType);
  const username = fetchedUser?.username ?? "";

  const MENU_LIST: MenuType[] = [
    {
      label: "Home",
      href: "/home",
      icon: Home,
    },
    {
      label: "Search",
      href: "/search",
      icon: Search,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      alert: fetchedUser?.hasNotification || false,
    },
    {
      label: "Grok",
      href: "/deepseek",
      icon: BadgeCheckIcon,
    },

    ...(isPro
      ? []
      : [
          {
            label: "Premium",
            href: "#premium",
          },
        ]),
    {
      label: "Profile",
      href: `/${username}`,
      icon: User,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ];
  // Antes: 14 líneas de apertura/cierre innecesarias
  // Después: 8 líneas, mismo resultado, mejor semántica

  return (
    <aside className="scrollbar-invisible top-14 overflow-x-hidden overflow-y-auto rounded-lg border border-black/20 p-4 dark:border-gray-800">
      {/* SECCIÓN 1: Logo + Menú principal */}
      <div className="flex flex-col gap-3 px-3 py-4 text-black dark:text-white">
        <Logo
          className="h-1 w-8 cursor-pointer pl-2 md:h-12 md:w-12"
          onClick={() => router.push("/home")}
        />

        <nav aria-label="Menú principal">
          {" "}
          {/* ✅ Añadido semántica */}
          {MENU_LIST.map((item) => (
            <SidebarItem
              key={item.href}
              {...item} // ✅ Spread operator para limpieza
            />
          ))}
        </nav>
      </div>

      {/* SECCIÓN 2: Botón de Post */}
      <div className="mt-4 px-3">
        {" "}
        {/* ✅ Contenedor con propósito claro */}
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="brandPrimary"
          className="hidden min-w-56 items-center justify-center py-7 text-lg font-semibold text-white transition hover:opacity-80 lg:flex">
          Post
        </Button>
        {/* Versión móvil (icono) */}
        {/* <Button
        onClick={() => setIsModalOpen(true)}
        variant="brandPrimary"
        size="icon"
        className="lg:hidden w-12 h-12 mx-auto rounded-full bg-red-700 hover:opacity-80 transition flex items-center justify-center"
      >
        <Feather size={24} className="text-white" />
      </Button>
       */}
        <PostFormModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          placeholder="What is happening"
        />
      </div>

      {/* SECCIÓN 3: Perfil de usuario */}
      <footer className="mt-auto">
        {" "}
        {/* ✅ Semánticamente es footer del aside */}
        {isLoading ? (
          <Spinner size="lg" className="mx-auto" />
        ) : (
          <UserDropdown
            username={fetchedUser.username}
            name={fetchedUser.name}
            profileImage={fetchedUser.profileImage}
            onLogout={doLogout}
          />
        )}
      </footer>
    </aside>
  );
};

export default Sidebar;
