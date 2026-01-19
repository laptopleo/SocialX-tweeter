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
import { useCurrentUserContext } from "@/context/currentuser-provider";
import { useUIStore } from "@/store/use-ui-store";
import {
  BadgeCheckIcon,
  Bell,
  Home,
  LucideIcon,
  Menu,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { doLogout } from "../../actions/auth.action";
import PostFormModal from "./_common/PostFormModal";
import SidebarItem from "./_common/SidebarItem";
import { UserDropdown } from "@/shared/UserDropdown";
import { MobileUserDropdown } from "@/shared/MobileUserDropdown";
import { PostIcon } from "@/shared/PostIconn";
import { UserType } from "@/types/user.type";

interface MenuType {
  label: string;
  href?: string;
  icon?: LucideIcon;
  alert?: boolean;
}

const MobileSidebar = (props: { isPro: boolean }) => {
  // ⚡ Zustand - más rápido que useState
  const isOpen = useUIStore((state) => state.isMobileSidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleMobileSidebar);
  const closeSidebar = useUIStore((state) => state.closeMobileSidebar);
  const isModalOpen = useUIStore((state) => state.isPostModalOpen);
  const openModal = useUIStore((state) => state.openPostModal);
  const closeModal = useUIStore((state) => state.closePostModal);

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

  const handleNavigation = (href?: string) => {
    if (href) {
      router.push(href);
      closeSidebar();
    }
  };

  return (
    <>
      {/* Botón Hamburguesa - Mejorado con accesibilidad */}
      <Button
        onClick={toggleSidebar}
        variant="ghost"
        size="icon"
        className="fixed left-0 top-0 z-50 h-10 w-10 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 lg:hidden"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} // ✅ Accesibilidad
        aria-expanded={isOpen}>
        {isOpen ? <X size={24} /> : <Menu size={34} />}
      </Button>

      {/* Overlay - Más limpio con operador lógico */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Drawer - Simplificado: eliminé el wrapper div innecesario */}
      <aside
        className={`// // // // fixed left-0 top-0 z-50 h-screen w-20 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-950 lg:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"} // // flex flex-col overflow-y-auto border-r border-gray-200 dark:border-gray-800`}>
        {/* Header - Semántico y sin wrapper div */}
        <header className="border-b border-gray-200 dark:border-gray-900 md:p-3">
          <Logo
            className="h-6 w-6 cursor-pointer md:h-8 md:w-8"
            onClick={() => {
              router.push("/home");
              closeSidebar();
            }}
          />
        </header>

        {/* Nav - Semántico, eliminé el wrapper div */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Menú móvil">
          {MENU_LIST.map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              onClick={closeSidebar} // ✅ Mueve la lógica aquí, no en un wrapper
            />
          ))}
        </nav>

        {/* Botón Post - Simplificado, SVG extraído */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <Button
            onClick={() => {
              openModal();
              closeSidebar();
            }}
            variant="brandPrimary"
            className="mx-auto flex h-14 w-14 items-center rounded-full"
            aria-label="Crear post">
            <PostIcon className="" /> {/* ✅ Icono como componente */}
          </Button>
        </div>

        {/* Footer - Ya era semántico, solo limpieza */}
        <footer className="mt-auto">
          {" "}
          {/* ✅ Añadí padding que faltaba */}
          {isLoading ? (
            <Spinner size="lg" className="mx-auto" />
          ) : (
            <MobileUserDropdown
              username={fetchedUser.username}
              name={fetchedUser.name}
              profileImage={fetchedUser.profileImage}
              onLogout={doLogout}
            />
          )}
        </footer>
      </aside>

      {/* Modal */}
      <PostFormModal open={isModalOpen} onClose={closeModal} placeholder="What is happening" />
    </>
  );
};

export default MobileSidebar;
