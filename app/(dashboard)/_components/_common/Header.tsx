"use client";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";

interface PropsType {
  label?: string;
  showBackArrow?: boolean;
  showBorder?: boolean;
  children?: React.ReactNode;
}

const Header: React.FC<PropsType> = ({ label, children, showBackArrow, showBorder = true }) => {
  const router = useRouter();
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);
  return (
    <div
      className={cn(
        "sticky top-0 z-30 flex w-full justify-center bg-background/90 p-4 text-black backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white",
        {
          "border-b-[1px] dark:border-[rgb(29,111,173)]": showBorder,
        }
      )}
    >
      <div className="flex flex-row items-center gap-5">
        {showBackArrow && (
          <ArrowLeft
            onClick={handleBack}
            color="currentColor"
            size={20}
            className="cursor-pointer transition hover:opacity-70"
          />
        )}
        {label ? <h1 className="text-xl font-semibold">{label}</h1> : <>{children}</>}
      </div>
    </div>
  );
};

export default Header;
