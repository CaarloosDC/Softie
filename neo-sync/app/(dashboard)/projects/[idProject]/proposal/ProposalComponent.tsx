"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import Container from "@/components/global/Container/Container";
import Header from "@/components/global/Container/Header";
import { Card, CardContent } from "@/components/ui/card";
import DownloadProposal from "./DownloadProposal";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ProjectInfo {
  nombre: string;
  descripcion: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

interface Requirement {
  id: string;
  nombre: string;
  descripcion: string;
  esfuerzo_requerimiento?: number;
  tiempo_requerimiento?: number;
  costo_requerimiento?: number;
}

export default function ProposalComponent() {
  const params = useParams();
  const projectId = params?.idProject as string;
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [proposalText, setProposalText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      // Fetch project info
      const { data: projectData, error: projectError } = await supabase
        .from("proyecto")
        .select("*")
        .eq("id", projectId)
        .single();

      if (projectError) {
        console.error("Error fetching project:", projectError);
        toast({
          title: "Error",
          description: "Failed to fetch project information",
          variant: "destructive",
        });
        return;
      }

      // Fetch requirements
      const { data: requirementsData, error: requirementsError } = await supabase
        .from("requerimiento")
        .select("*")
        .eq("proyecto_id", projectId);

      if (requirementsError) {
        console.error("Error fetching requirements:", requirementsError);
        toast({
          title: "Error",
          description: "Failed to fetch requirements",
          variant: "destructive",
        });
        return;
      }

      setProjectInfo(projectData);
      setRequirements(requirementsData);

      // Generate initial proposal text
      const initialProposal = generateProposalText(projectData, requirementsData);
      setProposalText(initialProposal);
      setIsLoading(false);
    };

    fetchData();
  }, [projectId]);

  const generateProposalText = (project: ProjectInfo, reqs: Requirement[]) => {
    const totalCost = reqs.reduce((sum, req) => sum + (req.costo_requerimiento || 0), 0);
    const totalEffort = reqs.reduce((sum, req) => sum + (req.esfuerzo_requerimiento || 0), 0);
    const totalTime = reqs.reduce((sum, req) => sum + (req.tiempo_requerimiento || 0), 0);

    return `
Propuesta de Proyecto: ${project.nombre}

Descripción del Proyecto:
${project.descripcion}

Requerimientos:
${reqs.map((req, index) => `
${index + 1}. ${req.nombre}
   Descripción: ${req.descripcion}
   Esfuerzo estimado: ${req.esfuerzo_requerimiento || 0} horas
   Tiempo estimado: ${req.tiempo_requerimiento || 0} días
   Costo estimado: $${req.costo_requerimiento || 0} USD
`).join('\n')}

Resumen de Estimaciones:
- Esfuerzo total: ${totalEffort} horas
- Tiempo total estimado: ${totalTime} días
- Costo total del proyecto: $${totalCost} USD

Fechas Importantes:
- Fecha de inicio propuesta: ${project.fecha_inicio || 'Por definir'}
- Fecha de finalización estimada: ${project.fecha_fin || 'Por definir'}
`;
  };

  if (isLoading) {
    return (
      <Container>
        <Header title="Cargando propuesta...">
          {/* Empty header while loading */}
        </Header>
        <Card className="mt-4">
          <CardContent className="min-h-[600px] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-sm text-gray-400">Cargando propuesta del proyecto...</p>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <Header title={`Propuesta de Proyecto: ${projectInfo?.nombre || ''}`}>
        <DownloadProposal 
          proposalText={proposalText}
          projectName={projectInfo?.nombre || ''}
        />
      </Header>

      <Card className="mt-4">
        <CardContent className="p-4">
          <Textarea
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            className="min-h-[600px] w-1/2 font-sans"
            placeholder="Propuesta del proyecto..."
          />
        </CardContent>
      </Card>
    </Container>
  );
}