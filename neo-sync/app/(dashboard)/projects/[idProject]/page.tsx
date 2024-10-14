"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, SlidersHorizontal, ChevronDown } from "lucide-react";
import InfoCard from "@/components/custom/Overview/InfoCard";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { initialRequirements } from "./mockData";
import { CreateRequirement } from "@/components/custom/Alerts/CreateRequirement";
import GenerateProposal from "@/components/custom/Alerts/GenerateProposal";

export default function RequirementsPage() {
  //* Function that will be passed to the SearchBar to filter the initialProjects and only show those on the kanban
  const [filteredRequirements, setFilteredRequirements] =
    useState(initialRequirements);
  const handleSearch = (query: string) => {
    const filtered = initialRequirements.filter(
      (project) =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequirements(filtered);
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      {/* Header */}
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">CEMEX</h1>
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

      {/* Bundle of main operations of the website */}
      <div className="flex flex-col gap-3 rounded-lg shadow-sm">
        <InfoCard />
        <CustomSeparator />
        <SearchBar onSearch={handleSearch} />
        <KanbanBoard data={filteredRequirements} />
      </div>
    </div>
  );
}
