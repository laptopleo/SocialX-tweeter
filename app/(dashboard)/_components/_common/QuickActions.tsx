"use client";
import React from "react";
import { useStore } from "@/hooks/useStore";
import { Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const QuickActions = () => {
  const { onOpenFeaturesModal, onOpenAboutModal } = useStore();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription className="text-sm">
          Explore platform features and information
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          onClick={onOpenFeaturesModal}>
          <Sparkles className="h-4 w-4" />
          <span>Platform Features</span>
        </Button>

        <Button
          variant="outline"
          className="w-full justify-start gap-2 transition-all duration-200 hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
          onClick={onOpenAboutModal}>
          <Info className="h-4 w-4" />
          <span>About SocialX</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
