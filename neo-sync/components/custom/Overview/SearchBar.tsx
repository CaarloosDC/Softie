"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  //* The searchbar will receive a function that will query the information displayed on the kanban
  const [query, setQuery] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setQuery(value);
    onSearch(value);
  };
  return (
    <div className="relative flex flex-row">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={handleSearchChange}
        placeholder="Buscar proyecto"
        className="w-full appearance-none bg-background pl-10 py-3 rounded-lg border hover:border-gray-500 shadow-sm"
      />
    </div>
  );
}
