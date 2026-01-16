import PusherClient from "pusher-js";

if (!process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  throw new Error("Pusher client environment variables are not defined. Please check your .env file.");
}

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    // Add any other client-side options here, e.g., authEndpoint for private channels
    // authEndpoint: "/api/pusher/auth",
  }
);
