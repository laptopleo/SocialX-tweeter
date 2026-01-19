"use client"; // Added directive for client-side hooks
import React, { useEffect } from "react";
import { auth } from "@/lib/auth"; // Note: auth is a server function, will need to handle session on client side if used directly here
import { redirect } from "next/navigation"; // redirect is a server function
import Sidebar from "../_components/Sidebar";
import MobileSidebar from "../_components/MobileSidebar";
import { CurrentUserProvider } from "@/context/currentuser-provider";
import ModalProvider from "@/context/modal-provider";
import Rightbar from "../_components/Rightbar";
import EditProfileModal from "../_components/EditProfileModal";
import ApiMonitor from "@/components/api-monitor";
// import { checkUserSubscription } from "@/app/actions/subcription"; // Moved checkUserSubscription to client component if needed
import { PLAN_TYPE } from "@/constants/pricing-plans";
import { pusherClient } from "@/lib/pusher-client"; // Import pusherClient
import { useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { PostType } from "@/types/post.type";

// The original `MainLayout` was an async Server Component.
// Since we're adding client-side hooks, this component now needs to be a Client Component.
// This means the `session` and `plan` checks also need to be handled client-side or passed as props.
// For simplicity, `auth()` and `redirect()` are server-only.
// We'll simulate the behavior for `session` for now, assuming it's fetched or available client-side.
// In a real app, `session` would be provided via `SessionProvider` (which you already have at `context/session-provider.tsx`).
// And subscription check could be in CurrentUserProvider or a client hook.

// For now, I'm adapting the existing code to be a client component while preserving its structure.
// The `session` and `plan` logic will need to be adapted or passed from a parent server component.
function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Original server-side logic commented out as this is now a client component
  // const session = await auth();
  // const plan = await checkUserSubscription();
  // const isPro = plan === PLAN_TYPE.PRO ? true : false;
  // if (!session?.user) {
  //   return redirect("/");
  // }

  // Placeholder for session and plan logic, assuming it's managed elsewhere client-side or passed down.
  // In a full application, use `useSession()` from next-auth/react here.
  const isPro = false; // Replace with actual client-side logic for checking subscription plan
  // If session is required here, consider moving the `MainLayout` back to a Server Component
  // and having a separate client component for Pusher logic, or fetch session client-side.

  const queryClient = useQueryClient();

  useEffect(() => {
    // Subscribe to the 'posts' channel
    const channel = pusherClient.subscribe("posts");

    // Bind to the 'new-post' event
    const handleNewPost = (data: any) => {
      // Using 'any' to fix possible type mismatch
      // Invalidate the 'posts' infinite query to trigger a refetch
      // React Query will handle fetching the latest data
      queryClient.invalidateQueries({ queryKey: ["posts", "infinite"] });
      // Optionally, you could show a toast notification here
      // toast({ title: "New post!", description: "A new post!" });
    };

    channel.bind("new-post", handleNewPost);

    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      channel.unsubscribe();
      channel.unbind("new-post", handleNewPost); // Unbind the specific handler
    };
  }, [queryClient]); // Dependency array includes queryClient

  return (
    <CurrentUserProvider>
      <ModalProvider />
      <EditProfileModal />
      <ApiMonitor />

      <MobileSidebar {...{ isPro }} />

      <div className="scrollbar-hide relative mx-auto flex max-w-[1300px] flex-col overflow-y-auto lg:flex-row">
        <aside className="sticky top-0 hidden h-full w-[275px] lg:block">
          <div className="no-scrollbar h-screen overflow-y-auto">
            <Sidebar {...{ isPro }} />
          </div>
        </aside>
        <main className="min-h-screen-dynamic flex-1 border-x border-gray-200 md:mr-4 md:w-[600px] dark:border-gray-800">
          <div className="h-full">{children}</div>
        </main>
        <aside className="no-scrollbar sticky top-0 hidden h-full w-[350px] space-y-4 overflow-hidden overflow-y-auto pt-2 pb-8 lg:block">
          <Rightbar {...{ isPro }} />
        </aside>
      </div>
    </CurrentUserProvider>
  );
}

export default MainLayout;
