import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users, Eye, Trash2, Plus } from "lucide-react";
import { EstimationsCard } from "./EstimationsCard";

interface TaskCardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskCardDrawer({
  isOpen,
  onClose,
}: TaskCardDrawerProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-[100vw] sm:max-w-[100vw] lg:max-w-[50vw] p-2 flex flex-col h-full"
      >
        {/* Chat */}
        <div className=" p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-2">Chat</h2>
          <p>Teams.</p>
        </div>

        {/* Estimations */}
        <EstimationsCard />
      </SheetContent>
    </Sheet>
  );
}
