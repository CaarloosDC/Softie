// ProjectsComponent.tsx (Client Component)
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  SlidersHorizontal,
  ChevronDown,
  UserPlus,
  Users,
} from "lucide-react";
import SearchBar from "@/components/custom/Overview/SearchBar";
import { KanbanBoard } from "@/components/custom/Overview/Kanban/KanbanBoard";
import CustomSeparator from "@/components/custom/Overview/CustomSeparator";
import BlueButton from "@/components/custom/BlueButton";
import { Task } from "@/components/custom/Overview/Kanban/TaskCard";
import { NewProject } from "@/components/custom/Alerts/NewProject";
// import { NewProject } from "@/components/custom/Alerts/NewProject/NewProject";
import { AddUser } from "@/components/custom/Alerts/AddUser";
import UserManagement from "@/components/custom/Alerts/UserManagement";
import Header from "@/components/global/Container/Header";
import Container from "@/components/global/Container/Container";

interface ProjectsComponentProps {
  projects: Task[];
}

export default function ProjectsComponent({
  projects,
}: ProjectsComponentProps) {
  const [filteredProjects, setFilteredProjects] = useState<Task[]>(projects);

  const router = useRouter();
  const handleSearch = (query: string) => {
    const filtered = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(query.toLowerCase()) ||
        project.content.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleCreateProject = async (projectData: any) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to create project: ${response.status} ${response.statusText}`
        );
      }

      const newProject = await response.json();
      console.log("New project created:", newProject);

      setFilteredProjects((prevProjects) => [...prevProjects, newProject]);

      
      router.refresh();

    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleAddUser = async (userData: any) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error(
          `Failed to add user: ${response.status} ${response.statusText}`
        );
      }

      const newUser = await response.json();
      console.log("New user added:", newUser);
      console.log("User added:", newUser);
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  //* Use parent container to render title and content
  return (
    <Container>
      <Header title="Dashboard">
        <BlueButton text="Nuevo proyecto" icon={<Plus className="h-4 w-4" />}>
          <NewProject onSubmit={handleCreateProject} />
        </BlueButton>
      </Header>

      {/* Content */}
      <SearchBar onSearch={handleSearch} />
      <KanbanBoard data={filteredProjects} />
    </Container>
  );

  //* Old way of rendering content, without parent container
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 mx-auto">
      <Header title="Dashboard">
        <BlueButton text="Nuevo proyecto" icon={<Plus className="h-4 w-4" />}>
          <NewProject onSubmit={handleCreateProject} />
        </BlueButton>
        <BlueButton
          text="Agregar usuario"
          icon={<UserPlus className="h-4 w-4" />}
        >
          <AddUser onSubmit={handleAddUser} />
        </BlueButton>
        <BlueButton
          text="Gestionar usuarios"
          icon={<Users className="h-4 w-4" />}
        >
          <UserManagement />
        </BlueButton>
        <Button
          size={"sm"}
          variant="outline"
          className="bg-gray-200 text-gray-700 hover:bg-gray-300 border-gray-300 rounded-md shadow-sm"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filtrar proyectos
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </Header>

      <div className="flex flex-col gap-3 rounded-lg shadow-sm">
        <CustomSeparator />
        <SearchBar onSearch={handleSearch} />
        <KanbanBoard data={filteredProjects} />
      </div>
    </div>
  );
}


