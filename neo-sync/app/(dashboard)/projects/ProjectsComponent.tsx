"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, SlidersHorizontal, ChevronDown } from "lucide-react";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { Task } from "@/components/custom/Overview/Kanban/TaskCard";
import { NewProject } from "@/components/custom/Overview/Alerts/NewProject"; // Corrected import

interface ProjectsComponentProps {
  projects: Task[];
}

export default function ProjectsComponent({ projects }: ProjectsComponentProps) {


    
  const [filteredProjects, setFilteredProjects] = useState<Task[]>(projects);

  const handleSearch = (query: string) => {
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
        <div className="flex flex-row justify-between gap-3">
          <BlueButton text="Nuevo Proyecto" icon={<Plus className="h-4 w-4" />}>
            <NewProject />
          </BlueButton>
          <Button
            variant="outline"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 rounded-md shadow-sm"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtrar proyectos
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg shadow-sm">
        <CustomSeparator />
        <SearchBar onSearch={handleSearch} />
        <KanbanBoard data={filteredProjects} />
      </div>
    </div>
  );
}