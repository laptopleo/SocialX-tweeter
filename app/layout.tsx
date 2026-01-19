import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SessionProviders from "@/context/session-provider";
import QueryProvider from "@/context/query-provider";
import { ThemeProvider } from "@/context/theme-provider";

const dmSans = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "SocialX - Connect with the world",
  description:
    "A modern social media platform to connect, share, and engage with people around the world.",
  openGraph: {
    title: "SocialX - Connect with the world",
    description:
      "A modern social media platform to connect, share, and engage with people around the world.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SocialX - Connect with the world",
    description:
      "A modern social media platform to connect, share, and engage with people around the world.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("h-full bg-black text-white", dmSans.className)}>
        <SpeedInsights />
        <SessionProviders>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange>
              <div className="h-screen-dynamic flex">{children}</div>
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
