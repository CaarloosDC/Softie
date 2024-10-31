import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, DollarSign, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { EditableField } from "./EditableField";
import CustomSeparator from "../../CustomSeparator";
import { useRouter } from "next/navigation";

interface EstimationsCardProps {
  initialData: {
    esfuerzo_requerimiento: number | null;
    tiempo_requerimiento: number | null;
    costo_requerimiento: number | null;
  } | null;
  requirementId: string;
}

export function EstimationsCard({
  initialData,
  requirementId,
}: EstimationsCardProps) {
  const router = useRouter();
  const [effort, setEffort] = useState(
    initialData?.esfuerzo_requerimiento ?? 0
  );
  const [cost, setCost] = useState(initialData?.costo_requerimiento ?? 0);
  const [time, setTime] = useState(initialData?.tiempo_requerimiento ?? 0);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      setEffort(initialData.esfuerzo_requerimiento ?? 0);
      setCost(initialData.costo_requerimiento ?? 0);
      setTime(initialData.tiempo_requerimiento ?? 0);
    }
  }, [initialData]);

  const handleEffortChange = (value: number) => {
    setEffort(value);
    setHasChanges(true);
  };

  const handleCostChange = (value: number) => {
    setCost(value);
    setHasChanges(true);
  };

  const handleTimeChange = (value: number) => {
    setTime(value);
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log("Starting save process for requirement:", requirementId);
    console.log("Data to save:", {
      esfuerzo_requerimiento: effort,
      tiempo_requerimiento: time,
      costo_requerimiento: cost,
    });

    try {
      const response = await fetch(
        `/api/requirements/${requirementId}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            esfuerzo_requerimiento: effort,
            tiempo_requerimiento: time,
            costo_requerimiento: cost,
          }),
        }
      );

      const result = await response.json();
      console.log("Response from server:", result);

      if (!response.ok) {
        throw new Error(result.error || "Failed to update requirement");
      }

      toast({
        title: "Éxito",
        description: "Estimaciones actualizadas correctamente",
      });

      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating estimations:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron actualizar las estimaciones: " +
          (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Estimaciones</CardTitle>
      </CardHeader>
      <CardContent>
        <CustomSeparator />
        <div className="flex flex-col gap-2 mt-2">
          <EditableField
            icon={Dumbbell}
            title="Esfuerzo"
            unit="horas"
            numberValue={effort}
            setNumberValue={handleEffortChange}
          />
          <EditableField
            icon={DollarSign}
            title="Costo"
            unit="USD"
            numberValue={cost}
            setNumberValue={handleCostChange}
          />
          <EditableField
            icon={Clock}
            title="Tiempo"
            unit="días"
            numberValue={time}
            setNumberValue={handleTimeChange}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {hasChanges && (
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : "Guardar"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
