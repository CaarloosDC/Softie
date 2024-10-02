import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter, ChevronDown } from "lucide-react";
import InfoCard from "@/components/custom/Overview/InfoCard";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";

export default function ProjectsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      <div className="flex justify-between max-w-[1082px]">
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
            <Calendar className="mr-2 h-4 w-4" />
            Agendar una reunión
          </Button>
          <Button
            variant="outline"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 rounded-md shadow-sm"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filtrar proyectos
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg max-w-[1082px] shadow-sm">
        {/* <InfoCard /> */}
        <CustomSeparator />
        <SearchBar />
        <KanbanBoard />
      </div>
    </main>
  );
}
