import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import InfoCard from "@/components/custom/Overview/InfoCard";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex flex-row justify-between gap-3">
          <Button
            variant="default"
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
          <Button
            variant="default"
            className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo proyecto
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg  shadow-sm">
        <InfoCard />
        <CustomSeparator />
        <SearchBar />
        <KanbanBoard />
      </div>
    </main>
  );
}
