"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import Container from "@/components/global/Container/Container";
import Header from "@/components/global/Container/Header";
import { Card, CardContent } from "@/components/ui/card";
import DownloadProposal from "./DownloadProposal";
import { Editor } from '@tinymce/tinymce-react';
import { Loader2 } from "lucide-react";
import Cronogram from './Cronogram';

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

// Add this interface for TypeScript
interface EditorProps {
  initialValue: string;
  onChange: (content: string) => void;
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

    const formatTeamSection = (teamSummary: Record<string, { jr: number; mid: number; sr: number }>) => {
      return Object.entries(teamSummary)
        .map(([role, counts]) => {
          const levels = [
            counts.sr > 0 ? `${counts.sr} Senior` : '',
            counts.mid > 0 ? `${counts.mid} Mid-level` : '',
            counts.jr > 0 ? `${counts.jr} Junior` : ''
          ].filter(Boolean);
          
          return levels.length > 0
            ? `<p><strong>${role}:</strong><br/>
               ${levels.map(level => `&bull; ${level}`).join('<br/>')}</p>`
            : '';
        })
        .filter(Boolean)
        .join('\n');
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

    return `
<h2>Propuesta de Proyecto: ${project.nombre}</h2>

<h3>Descripción del Proyecto:</h3>
<p>${project.descripcion}</p>

<h3>Cronograma de Requerimientos:</h3>
${sortedReqs.map((req, index) => `
<div style="margin-bottom: 20px;">
  <p><strong>${index + 1}. ${req.nombre}</strong><br/>
  <strong>Descripción:</strong> ${req.descripcion}<br/>
  <strong>Fecha inicio:</strong> ${formatDate(req.fecha_inicio)}<br/>
  <strong>Fecha fin:</strong> ${formatDate(req.fecha_fin)}<br/>
  <strong>Esfuerzo estimado:</strong> ${req.esfuerzo_requerimiento || 0} horas<br/>
  <strong>Tiempo estimado:</strong> ${req.tiempo_requerimiento || 0} días<br/>
  <strong>Costo estimado:</strong> $${req.costo_requerimiento?.toLocaleString() || 0} USD</p>
</div>`).join('')}

<h3>Resumen de Estimaciones:</h3>
<p>&bull; Esfuerzo total: ${totalEffort} horas<br/>
&bull; Tiempo total estimado: ${totalTime} días<br/>
&bull; Costo total del proyecto: $${totalCost.toLocaleString()} USD</p>

<h3>Fechas Importantes:</h3>
<p>&bull; Fecha de inicio propuesta: ${formatDate(projectStartDate)}<br/>
&bull; Fecha de finalización estimada: ${formatDate(projectEndDate)}</p>

<h3>Equipo del Proyecto:</h3>
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
        {/* <DownloadProposal 
          proposalText={proposalText}
          projectName={projectInfo?.nombre || ''}
        /> */}
      </Header>

      <Card className="mt-4">
        <CardContent className="p-4">
          <Editor
            apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
            value={proposalText}
            init={{
              height: 600,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'exportpdf'
              ],
              toolbar: 'undo redo | formatselect | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | exportpdf | help',
              content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px; }',
              paste_data_images: true,
              browser_spellcheck: true
            }}
            onEditorChange={(content) => setProposalText(content)}
          />
        </CardContent>
      </Card>

      <Cronogram projectId={projectId} />
    </Container>
  );
}