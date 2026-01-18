"use client";
import React from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardDescription } from "../ui/card";
import { useStore } from "@/hooks/useStore";

const UpgradeCard = () => {
  const { onOpenProModal } = useStore();

  return (
    <Card
      role="button"
      className="flex h-[220px] w-full max-w-[350px] cursor-pointer items-center justify-center border-dashed border-gray-400"
      onClick={onOpenProModal}>
      <CardContent className="flex items-center gap-2">
        <div className="rounded-full border-2 p-1">
          <Plus className="text-gray-400" />
        </div>
        <CardDescription className="font-semibold">Upgrade Plan</CardDescription>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;
