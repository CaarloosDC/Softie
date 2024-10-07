import React from "react";
import RequirementsComponent from "./RequirementsComponent";
import { getRequirements } from "./getRequirements";

export default async function ProjectPage({ params }: { params: { idProject: string } }) {
  const requirements = await getRequirements(params.idProject);

  return <RequirementsComponent requirements={requirements} />;
}