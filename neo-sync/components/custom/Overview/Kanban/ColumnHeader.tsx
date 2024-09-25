import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button"; // Ensure you have the Button component imported, or use a basic button element.

export default function ColumnHeader({ column }: { column: string }) {
  return (
    <div className="flex flex-row justify-between bg-white dark:bg-primary-foreground p-2 shadow-sm rounded-md">
      <span>{column}</span> {/* Directly use column since it's a string */}
      {/* Make Plus icon a button */}
      <button
        type="button"
        className="p-2 rounded-md bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700" // Tailwind classes for styling the button
      >
        <Plus className="h-4 w-4" /> {/* Icon inside the button */}
      </button>
    </div>
  );
}
