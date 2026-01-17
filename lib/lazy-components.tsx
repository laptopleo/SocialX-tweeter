/**
 * ⚡ LAZY LOADING DE COMPONENTES PESADOS
 *
 * Importa componentes pesados de forma lazy para mejorar el tiempo de carga inicial
 */

import dynamic from "next/dynamic";

// ⚡ Modal de edición de perfil
export const EditProfileModal = dynamic(
  () => import("@/app/(dashboard)/_components/EditProfileModal"),
  {
    loading: () => null,
    ssr: false,
  }
);

// ⚡ Modal Pro
export const ProModal = dynamic(() => import("@/components/pro-modal"), {
  loading: () => null,
  ssr: false,
});

// ⚡ GIF Picker (pesado)
export const GifPicker = dynamic(() => import("@/components/gif"), {
  loading: () => <div className="h-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />,
  ssr: false,
});
