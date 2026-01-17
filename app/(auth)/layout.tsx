import React from "react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (session?.user) {
    return redirect("/home");
  }
  return (
    <div className="h-screen w-full">
      <div className="mx-auto h-full">{children}</div>
    </div>
  );
}

export default AuthLayout;
