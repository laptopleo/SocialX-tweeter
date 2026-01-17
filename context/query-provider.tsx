"use client";
import { ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children: ReactNode;
}

export default function QueryProvider({ children }: Props) {
  // ⚡ Crear QueryClient solo una vez con useState
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // ⚡ Cache por 5 minutos
            staleTime: 1000 * 60 * 5,
            // ⚡ Mantener datos en cache por 10 minutos
            gcTime: 1000 * 60 * 10,
            // ⚡ Reintentar solo 1 vez en caso de error
            retry: 1,
            // ⚡ No refetch automático al hacer focus
            refetchOnWindowFocus: false,
            // ⚡ No refetch al reconectar
            refetchOnReconnect: false,
          },
          mutations: {
            // ⚡ No reintentar mutaciones fallidas
            retry: 0,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
