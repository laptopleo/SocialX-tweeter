import React from "react";
import { Spinner } from "@/components/spinner";

const Loading = () => {
  return (
    <div className="h-screen-dynamic bg-background w-full">
      <div className="h-screen-dynamic flex w-full flex-col items-center justify-center">
        <Spinner size="icon" />
      </div>
    </div>
  );
};

export default Loading;
