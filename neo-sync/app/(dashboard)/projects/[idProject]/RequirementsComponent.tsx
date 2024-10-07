"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, SlidersHorizontal } from "lucide-react";
import InfoCard from "@/components/custom/Overview/InfoCard";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { CreateRequirement } from "@/components/custom/Overview/Alerts/CreateRequirement";
import GenerateProposal from "@/components/custom/Overview/Alerts/GenerateProposal";
import { useParams } from "next/navigation";
import { Task } from "@/components/custom/Overview/Kanban/TaskCard";

interface RequirementsComponentProps {
  requirements: Task[];
}

export default function RequirementsComponent({ requirements }: RequirementsComponentProps) {
  const params = useParams();
  const projectId = params.idProject;

  const [filteredRequirements, setFilteredRequirements] = useState<Task[]>(requirements);

  const handleSearch = (query: string) => {
    const filtered = requirements.filter(
      (requirement) =>
        requirement.title.toLowerCase().includes(query.toLowerCase()) ||
        requirement.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequirements(filtered);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Project: {projectId}</h1>
        <div className="flex flex-row justify-between gap-3">
          <BlueButton
            text="Agregar Requerimiento"
            icon={<Plus className="h-4 w-4" />}
          >
            <CreateRequirement />
          </BlueButton>
          <BlueButton
            text="Generar Propuesta"
            icon={<Calendar className="h-4 w-4" />}
          >
            <GenerateProposal />
          </BlueButton>
          <Button
            variant="outline"
            className="bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium flex items-center"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg shadow-sm">
        <InfoCard />
        <CustomSeparator />
        <SearchBar onSearch={handleSearch} />
        <KanbanBoard data={filteredRequirements} />
      </div>
    </div>
  );
}