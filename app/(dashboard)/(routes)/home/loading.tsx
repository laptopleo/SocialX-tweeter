import React from "react";
import { Spinner } from "@/components/spinner";

const Loading = () => {
  return (
    <div className="h-screen-dynamic w-full bg-background">
      <div className="flex h-screen-dynamic w-full flex-col items-center justify-center">
        <Spinner size="icon" />
      </div>
    </div>
  );
};

export default Loading;
