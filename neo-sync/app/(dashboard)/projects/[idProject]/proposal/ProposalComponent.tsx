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
  fecha_inicio?: string;
  fecha_fin?: string;
}

interface TeamMember {
  id: number;
  rol: string;
  experiencia: string;
}

export default function ProposalComponent() {
  const params = useParams();
  const projectId = params?.idProject as string;
  
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [proposalText, setProposalText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      
      const [
        { data: projectData, error: projectError },
        { data: requirementsData, error: requirementsError },
        { data: teamData, error: teamError }
      ] = await Promise.all([
        supabase.from("proyecto").select("*").eq("id", projectId).single(),
        supabase.from("requerimiento").select("*").eq("proyecto_id", projectId),
        supabase.from("equipo_proyecto").select("*").eq("proyecto_id", projectId)
      ]);

      if (projectError) {
        console.error("Error fetching project:", projectError);
        toast({
          title: "Error",
          description: "Failed to fetch project information",
          variant: "destructive",
        });
        return;
      }

      if (requirementsError) {
        console.error("Error fetching requirements:", requirementsError);
        toast({
          title: "Error",
          description: "Failed to fetch requirements",
          variant: "destructive",
        });
        return;
      }

      if (teamError) {
        console.error("Error fetching team:", teamError);
        toast({
          title: "Error",
          description: "Failed to fetch team information",
          variant: "destructive",
        });
        return;
      }

      setProjectInfo(projectData);
      setRequirements(requirementsData || []);
      setTeamMembers(teamData || []);

      const initialProposal = generateProposalText(projectData, requirementsData || [], teamData || []);
      setProposalText(initialProposal);
      setIsLoading(false);
    };

    fetchData();
  }, [projectId]);

  const generateProposalText = (project: ProjectInfo, reqs: Requirement[], team: TeamMember[]) => {
    const totalCost = reqs.reduce((sum, req) => sum + (req.costo_requerimiento || 0), 0);
    const totalEffort = reqs.reduce((sum, req) => sum + (req.esfuerzo_requerimiento || 0), 0);
    const totalTime = reqs.reduce((sum, req) => sum + (req.tiempo_requerimiento || 0), 0);

    const sortedReqs = [...reqs].sort((a, b) => {
      const dateA = a.fecha_inicio ? new Date(a.fecha_inicio).getTime() : 0;
      const dateB = b.fecha_inicio ? new Date(b.fecha_inicio).getTime() : 0;
      return dateA - dateB;
    });

    const projectStartDate = sortedReqs[0]?.fecha_inicio;
    const projectEndDate = sortedReqs[sortedReqs.length - 1]?.fecha_fin;

    const formatDate = (dateString?: string) => {
      if (!dateString) return 'Por definir';
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };

    const teamSummary = team.reduce((acc, member) => {
      const role = member.rol === 'developer' ? 'Desarrolladores' :
                   member.rol === 'ui_ux' ? 'UI/UX' :
                   member.rol === 'scrum_master' ? 'Scrum Masters' :
                   member.rol === 'qa' ? 'QA' : 'Otros';
      
      const exp = member.experiencia === 'senior' ? 'Sr' :
                  member.experiencia === 'mid' ? 'Mid' :
                  member.experiencia === 'junior' ? 'Jr' : '';
      
      acc[role] = acc[role] || { jr: 0, mid: 0, sr: 0 };
      if (exp === 'Sr') acc[role].sr++;
      if (exp === 'Mid') acc[role].mid++;
      if (exp === 'Jr') acc[role].jr++;
      
      return acc;
    }, {} as Record<string, { jr: number; mid: number; sr: number }>);

    const formatTeamSection = (teamSummary: Record<string, { jr: number; mid: number; sr: number }>) => {
      return Object.entries(teamSummary)
        .map(([role, counts]) => {
          const levels = [
            counts.sr > 0 ? `${counts.sr} Senior` : '',
            counts.mid > 0 ? `${counts.mid} Mid-level` : '',
            counts.jr > 0 ? `${counts.jr} Junior` : ''
          ].filter(Boolean);
          
          return levels.length > 0
            ? `${role}:\n- ${levels.join('\n- ')}`
            : '';
        })
        .filter(Boolean)
        .join('\n\n');
    };

    return `
Propuesta de Proyecto: ${project.nombre}

Descripción del Proyecto:
${project.descripcion}

Cronograma de Requerimientos:
${sortedReqs.map((req, index) => `
${index + 1}. ${req.nombre}
   Descripción: ${req.descripcion}
   Fecha inicio: ${formatDate(req.fecha_inicio)}
   Fecha fin: ${formatDate(req.fecha_fin)}
   Esfuerzo estimado: ${req.esfuerzo_requerimiento || 0} horas
   Tiempo estimado: ${req.tiempo_requerimiento || 0} días
   Costo estimado: $${req.costo_requerimiento?.toLocaleString() || 0} USD`).join('\n')}

Resumen de Estimaciones:
- Esfuerzo total: ${totalEffort} horas
- Tiempo total estimado: ${totalTime} días
- Costo total del proyecto: $${totalCost.toLocaleString()} USD

Fechas Importantes:
- Fecha de inicio propuesta: ${formatDate(projectStartDate)}
- Fecha de finalización estimada: ${formatDate(projectEndDate)}

Equipo del Proyecto:
${formatTeamSection(teamSummary)}`;
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