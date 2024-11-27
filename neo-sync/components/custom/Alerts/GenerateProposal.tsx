"use client";

import {
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertCircle,
  Wand2Icon,
  FileText,
  List,
  Target,
  Hourglass,
  DollarSign,
  Code2,
  Paintbrush,
  ScrollText,
  TestTubes,
  Users2,
  Loader2,
} from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import SelectContract from "./SelectContract";
import { supabase } from "@/lib/db";
import { Contract } from "./SelectContract";

interface Requirement {
  id: string;
  nombre: string;
  descripcion: string;
  esfuerzo_requerimiento?: number;
  tiempo_requerimiento?: number;
  costo_requerimiento?: number;
}

interface TeamMember {
  id: number;
  rol: string;
  experiencia: string;
}

export default function GenerateProposal() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.idProject as string;
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contracts, setContracts] = useState<Contract[]>([
    {
      name: ".",
      url: ".",
    },
  ]);

  const supabase = createClient();

  const [selectedName, setSelectedName] = useState<string | null>(null);
  const add_url_to_proyect = async (name: string) => {
    try {
      const { error } = await supabase
        .from("proyecto")
        .update({
          contrato_marco_url: name,
        })
        .eq("id", projectId);

      if (error) {
        console.error("Error updating contract:", error);
        throw error;
      }
      setSelectedName(name);
    } catch (error) {
      console.error("Error in add_url_to_proyect:", error);
      throw error; // Re-throw to be handled by the select component
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [requirementsResponse, teamResponse] = await Promise.all([
        supabase.from("requerimiento").select("*").eq("proyecto_id", projectId),
        supabase
          .from("equipo_proyecto")
          .select("*")
          .eq("proyecto_id", projectId),
      ]);

      if (requirementsResponse.error) {
        console.error(
          "Error fetching requirements:",
          requirementsResponse.error
        );
      } else {
        setRequirements(requirementsResponse.data || []);
      }

      if (teamResponse.error) {
        console.error("Error fetching team:", teamResponse.error);
      } else {
        setTeamMembers(teamResponse.data || []);
      }

      setIsLoading(false);
    };
    const fetchContracts = async () => {
      const { data, error } = await supabase.storage
        .from("contratosMarco")
        .list();

      if (error) {
        console.error("Error fetching contracts:", error);
        return;
      }

      if (!data || data.length === 0) {
        console.log("No contracts found in the bucket.");
        return;
      }

      // console.log("Fetching contracts:", data);

      // Para cada documento, obtener la URL firmada
      const documentsWithPreview = await Promise.all(
        data.map(async (doc) => {
          const { data: signedUrlData, error: urlError } =
            await supabase.storage
              .from("contratosMarco")
              .createSignedUrl(doc.name, 60);

          if (urlError) {
            console.error("Error fetching preview URL:", urlError);
            return { ...doc, previewUrl: null };
          }

          return { ...doc, previewUrl: signedUrlData?.signedUrl };
        })
      );

      setContracts(
        documentsWithPreview.map((doc) => {
          return { name: doc.name, url: doc.previewUrl || "-" };
        })
      );
    };

    fetchContracts();
    fetchData();
  }, [projectId]);

  useEffect(() => {
    const fetchSelectedContract = async () => {
      const { data: projectData, error: projectError } = await supabase
        .from("proyecto")
        .select("contrato_marco_url")
        .eq("id", projectId)
        .single();

      setSelectedName(projectData?.contrato_marco_url);
    };

    fetchSelectedContract();
  }, [contracts]);

  // Calculate totals
  const totalRequirements = requirements.length;
  const totalEffort = requirements.reduce(
    (sum, req) => sum + (req.esfuerzo_requerimiento || 0),
    0
  );
  const totalCost = requirements.reduce(
    (sum, req) => sum + (req.costo_requerimiento || 0),
    0
  );
  const totalTime = requirements.reduce(
    (sum, req) => sum + (req.tiempo_requerimiento || 0),
    0
  );

  // Calculate team summary
  const teamSummary = teamMembers.reduce((acc, member) => {
    const role =
      member.rol === "developer"
        ? "Desarrolladores"
        : member.rol === "ui_ux"
        ? "UI/UX"
        : member.rol === "scrum_master"
        ? "Scrum Masters"
        : member.rol === "qa"
        ? "QA"
        : "Otros";

    const exp =
      member.experiencia === "senior"
        ? "Sr"
        : member.experiencia === "mid"
        ? "Mid"
        : member.experiencia === "junior"
        ? "Jr"
        : "";

    acc[role] = acc[role] || { jr: 0, mid: 0, sr: 0 };
    if (exp === "Sr") acc[role].sr++;
    if (exp === "Mid") acc[role].mid++;
    if (exp === "Jr") acc[role].jr++;

    return acc;
  }, {} as Record<string, { jr: number; mid: number; sr: number }>);

  const alerts = [
    "Insuficientes recursos para cumplir la meta establecida.",
    "El presupuesto actual rebasa el límite establecido por el cliente.",
    "El desarrollador Sebastian tendrá vacaciones durante el proyecto.",
    "Debes de asignar un project manager al proyecto.",
  ];

  const handleGenerateProposal = () => {
    router.push(`/projects/${projectId}/proposal`);
  };

  // Add role icons mapping
  const roleIcons = {
    Desarrolladores: <Code2 className="w-3 h-3" />,
    "UI/UX": <Paintbrush className="w-3 h-3" />,
    "Scrum Masters": <ScrollText className="w-3 h-3" />,
    QA: <TestTubes className="w-3 h-3" />,
    Otros: <Users2 className="w-3 h-3" />,
  };

  if (isLoading) {
    return (
      <>
        <AlertDialogHeader className="text-center">
          <AlertDialogTitle className="text-xl font-bold">
            Resumen de la propuesta
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="min-h-[300px] flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-400">
            Cargando resumen del proyecto...
          </p>
        </AlertDialogDescription>

        <Separator />

        <AlertDialogFooter className="flex flex-col">
          <AlertDialogCancel className="w-1/2" disabled>
            Cerrar
          </AlertDialogCancel>
          <AlertDialogAction className="w-1/2" disabled>
            <FileText className="w-3 h-3 mr-2" /> Generar propuesta
          </AlertDialogAction>
        </AlertDialogFooter>
      </>
    );
  }

  return (
    <>
      <AlertDialogHeader className="text-center">
        <AlertDialogTitle className="text-xl font-bold">
          Resumen de la propuesta
        </AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription className="space-y-2 mt-1">
        <div className="space-y-2">
          <AlertDialogTitle className="text-xl font-bold">
            Resumen
          </AlertDialogTitle>
          <SummaryItem
            icon={<List className="w-3 h-3" />}
            title="Requerimientos totales:"
            content={totalRequirements}
          />
          <SummaryItem
            icon={<Target className="w-3 h-3" />}
            title="Estimación de esfuerzo:"
            content={`96 horas`}
          />
          <SummaryItem
            icon={<Hourglass className="w-3 h-3" />}
            title="Tiempo estimado:"
            content={`140 días`}
          />
          <SummaryItem
            icon={<DollarSign className="w-3 h-3" />}
            title="Costo estimado:"
            content={`$86,000 USD`}
          />
        </div>
        <Separator />
        <div className="space-y-2 mt-4">
          <AlertDialogTitle className="text-sm font-bold">
            Equipo del Proyecto ({teamMembers.length} miembros)
          </AlertDialogTitle>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(teamSummary).map(([role, counts]) => (
              <div key={role} className="bg-gray-100 p-2 rounded-md">
                <div className="font-medium flex items-center gap-1">
                  {roleIcons[role as keyof typeof roleIcons]}
                  <span>{role}</span>
                </div>
                <div className="text-gray-600 ml-4">
                  {counts.sr > 0 && `${counts.sr} Sr `}
                  {counts.mid > 0 && `${counts.mid} Mid `}
                  {counts.jr > 0 && `${counts.jr} Jr`}
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />

        <SelectContract
          contracts={contracts}
          onSelectionUpdate={add_url_to_proyect}
          url={selectedName}
        />
        {/* Alerts Section */}
        {/* <div className="space-y-2">
          <AlertDialogTitle className="text-xl font-bold text-red-500">
            Alertas
          </AlertDialogTitle>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className="flex justify-start items-center space-x-2 text-sm text-red-500 bg-red-50 p-2 rounded-md"
              >
                <AlertCircle className="w-3 h-3 mt-0.5" />
                <span>{alert}</span>
              </div>
            ))}
          </div>
        </div> */}
        {/* AI Button */}
        {/* <Button
          size={"sm"}
          variant="default"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-md"
        >
          <Wand2Icon className="w-4 mr-1" />
          Solucionar con inteligencia artificial
        </Button> */}
      </AlertDialogDescription>

      <Separator />

      {/* Footer Section for create/cancel buttons */}
      <AlertDialogFooter className="flex flex-col">
        <AlertDialogCancel className="w-1/2">Cerrar</AlertDialogCancel>
        <AlertDialogAction className="w-1/2" onClick={handleGenerateProposal}>
          <FileText className="w-3 h-3 mr-2" /> Generar propuesta
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
}

// * The component below is only used in the main component of this code. Thats why is only declared here
interface SummaryItemProps {
  icon: ReactNode;
  title: string;
  content: string | number;
}

const SummaryItem: React.FC<SummaryItemProps> = ({ icon, title, content }) => {
  return (
    <div className="flex justify-between text-sm bg-gray-100 p-2 rounded-md">
      <div className="flex gap-2 items-center">
        {icon}
        <span className="text-gray-600">{title}</span>
      </div>
      <span className="font-semibold">{content}</span>
    </div>
  );
};
