import React from "react";
import ProjectsComponent from "./ProjectsComponent";
import { getProjects } from "./getProjects";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsComponent projects={projects} />;
}