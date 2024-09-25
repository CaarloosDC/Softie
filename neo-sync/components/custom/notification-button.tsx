import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationButton() {
  return (
    <Button variant="outline" size="icon">
      <div className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-[-2px]  inline-flex h-2 w-2 rounded-full bg-red-500"></span>
      </div>
    </Button>
  );
}
