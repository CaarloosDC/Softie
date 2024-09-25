import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <div className="relative flex flex-row">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Buscar requerimiento"
        className="w-full appearance-none bg-background pl-10 py-3 rounded-lg border border-gray-400 hover:border-gray-500 shadow-sm"
      />
    </div>
  );
}
