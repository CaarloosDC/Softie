// TaskCardDrawer.tsx
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EstimationsCard } from "./EstimationsCard";
import { RequirementDescription } from "./RequirementDescription";
import { RequirementHeader } from "./RequirementHeader"; // New component
import { useEffect, useState } from "react";
import { Estimation } from "@/types/types";
import { createClient } from "@/utils/supabase/client";
import { TodoList } from "./TodoList";
import TeamsChatWrapper from "@/components/teams-chat/TeamsChatWrapper";
import { Loader2 } from "lucide-react";


interface RequirementData {
  id: string;
  nombre: string;
  tipo: "funcional" | "no funcional";
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estatus: string;
}

interface TaskCardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId: string;
  onTodoCountsChange?: (counts: { total: number; completed: number }) => void;
}

export default function TaskCardDrawer({
  isOpen,
  onClose,
  requirementId,
  onTodoCountsChange,
}: TaskCardDrawerProps) {
  const [estimationData, setEstimationData] = useState<Estimation | null>(null);
  const [requirementData, setRequirementData] =
    useState<RequirementData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const [estimationResponse, requirementResponse] = await Promise.all([
        supabase
          .from("requerimiento")
          .select(
            "esfuerzo_requerimiento, tiempo_requerimiento, costo_requerimiento"
          )
          .eq("id", requirementId)
          .single(),
        supabase
          .from("requerimiento")
          .select("id, nombre, tipo, fecha_inicio, fecha_fin, estatus")
          .eq("id", requirementId)
          .single(),
      ]);

      if (estimationResponse.error) {
        console.error(
          "Error fetching estimation data:",
          estimationResponse.error
        );
      } else {
        setEstimationData({
          ...estimationResponse.data,
          requerimiento_id: requirementId,
        });
      }

      if (requirementResponse.error) {
        console.error(
          "Error fetching requirement data:",
          requirementResponse.error
        );
      } else {
        const data = requirementResponse.data;
        if (data.fecha_inicio) {
          const date = new Date(data.fecha_inicio);
          data.fecha_inicio = new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
        }
        if (data.fecha_fin) {
          const date = new Date(data.fecha_fin);
          data.fecha_fin = new Date(date.getTime() + date.getTimezoneOffset() * 60000).toISOString();
        }
        setRequirementData(data);
      }

      setIsLoading(false);
    };

    if (isOpen && requirementId) {
      fetchData();
    }
  }, [isOpen, requirementId]);

  if (isLoading) {
    return (
      <Sheet
        open={isOpen}
        onOpenChange={onClose}>
        <SheetContent
          side="right"
          className="w-full max-w-[100vw] sm:max-w-[100vw] lg:max-w-[50vw] p-2">
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet
      open={isOpen}
      onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-[100vw] sm:max-w-[100vw] lg:max-w-[50vw] p-2 flex flex-col h-full"
      >
        <div className="flex-grow overflow-y-auto space-y-6">
          {requirementData && (
            <RequirementHeader
              data={requirementData}
              onClose={onClose}  // Add this line
              onUpdate={(updatedData) => setRequirementData(updatedData)}
            />
          )}
          <RequirementDescription requirementId={requirementId} />
          <TodoList
            requirementId={requirementId}
            onTodoCountsChange={onTodoCountsChange}
          />

          {/* Chat section */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Chat</h2>
            <TeamsChatWrapper />
          </div>

          {/* Estimations section */}
          {estimationData && (
            <EstimationsCard
              initialData={estimationData}
              requirementId={requirementId}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
