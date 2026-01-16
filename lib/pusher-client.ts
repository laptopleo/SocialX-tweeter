import PusherClient from "pusher-js";

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error("Pusher client environment variables are not defined. Please check your .env file.");
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    // Deshabilitar transports que requieren acceso a red local
    forceTLS: true, // Forzar conexión segura
    disableStats: true, // Deshabilitar estadísticas
    enabledTransports: ['ws', 'wss'], // Solo WebSockets seguros
    // authEndpoint: "/api/pusher/auth", // Para canales privados
  }
);
