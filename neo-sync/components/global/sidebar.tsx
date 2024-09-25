import { SidebarContent } from "@/components/global/sidebar-content";

export function Sidebar() {
  return (
    <div className="hidden md:block bg-muted/40 md:bg-white dark:bg-gray-800">
      <SidebarContent />
    </div>
  );
}
