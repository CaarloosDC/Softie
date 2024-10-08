// components/custom/Overview/NewProjectButton.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { NewProject } from "@/components/custom/Overview/Alerts/NewProject";

interface NewProjectButtonProps {
  onCreateProject: (projectData: any) => Promise<void>;
}

export default function NewProjectButton({ onCreateProject }: NewProjectButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = async (projectData: any) => {
    await onCreateProject(projectData);
    setIsDialogOpen(false);
  };

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Proyecto
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <NewProject onSubmit={handleSubmit} />
      </AlertDialogContent>
    </AlertDialog>
  );
}