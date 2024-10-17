"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, SlidersHorizontal } from "lucide-react";
import InfoCard from "@/components/custom/Overview/InfoCard";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { CreateRequirement } from "@/components/custom/Alerts/CreateRequirement";
import GenerateProposal from "@/components/custom/Alerts/GenerateProposal";
import { useParams } from "next/navigation";
import { Task } from "@/components/custom/Overview/Kanban/TaskCard";
import { createClient } from '@/utils/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";



interface RequirementsComponentProps {
  requirements: Task[];
}

export default function RequirementsComponent({
  requirements,
}: RequirementsComponentProps) {
  const params = useParams();
  const projectId = params?.idProject as string;
  const router = useRouter()

  const [filteredRequirements, setFilteredRequirements] = useState<Task[]>(requirements);
  const [projectInfo, setProjectInfo] = useState<{ id: string; nombre: string; descripcion: string } | null>(null);


  useEffect(() => {
    const fetchProjectInfo = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('proyecto')
        .select('id, nombre, descripcion')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProjectInfo(data);
      }
    };

    fetchProjectInfo();
  }, [projectId]);

  const handleSearch = (query: string) => {
    const filtered = requirements.filter(
      (requirement) =>
        requirement.title.toLowerCase().includes(query.toLowerCase()) ||
        requirement.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRequirements(filtered);
  };

  const handleCreateRequirement = async (requirementData: any) => {
    try {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...requirementData,
          proyecto_id: projectId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to create project: ${response.status} ${response.statusText}`
        );
      }

      const newRequirement = await response.json();
      console.log("New Requirement created:", newRequirement);

      toast({
        title: "Requirement created",
        description: "Your new requirement has been successfully created.",
      });
      setFilteredRequirements(prevRequirements => [...prevRequirements, newRequirement]);
      router.refresh()

      // Here you might want to update your local state or refetch projects
    } catch (error) {
      console.error("Error creating requirement:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "There was a problem creating your requirement.",
      });
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      <div className="flex justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">
          Project: {projectInfo?.nombre || projectId}
        </h1>
        <div className="flex flex-row justify-between gap-3">
          <BlueButton
            text="Agregar Requerimiento"
            icon={<Plus className="h-4 w-4" />}
          >
            <CreateRequirement onSubmit={handleCreateRequirement} projectId={parseInt(projectId, 10)}/>
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
        {projectInfo && <InfoCard projectInfo={projectInfo} />}
        <CustomSeparator />
        <SearchBar onSearch={handleSearch} />
        <KanbanBoard data={filteredRequirements} />
      </div>
    </div>
  );
}