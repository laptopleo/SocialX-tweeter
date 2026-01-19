"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const SearchForm = () => {
  const router = useRouter();
  const param = useSearchParams();
  const query = param.get("q") ?? "";
  const filter = param.get("f") ?? "";

  const [searchTerm, setSearchTerm] = React.useState(query);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchTerm?.trim()) {
      const baseUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
      const url = filter ? `${baseUrl}&f=user` : baseUrl;
      router.push(url);
    }
  };
  return (
    <div className="w-full">
      <form className="w-full" action="#" role="search" onSubmit={handleSubmit}>
        <div className="relative flex h-11 flex-row items-center rounded-full bg-[#eee] dark:bg-black">
          <div className="text-muted-foreground flex w-8 shrink-0 items-center !justify-end">
            <SearchIcon size="20px" />
          </div>
          <div className="flex-1">
            <Input
              className="h-full w-full rounded-full border-0 !ring-0 !outline-none"
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
