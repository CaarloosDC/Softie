import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CustomSeparator from "../../CustomSeparator";
import { Pencil } from "lucide-react";

interface RequirementDescriptionProps {
  requirementId: string;
}

export function RequirementDescription({
  requirementId,
}: RequirementDescriptionProps) {
  const router = useRouter();
  const [description, setDescription] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [originalDescription, setOriginalDescription] = useState<string>("");

  useEffect(() => {
    const fetchDescription = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("requerimiento")
        .select("descripcion")
        .eq("id", requirementId)
        .single();

      if (error) {
        console.error("Error fetching description:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar la descripción",
          variant: "destructive",
        });
        return;
      }

      setDescription(data.descripcion || "");
      setOriginalDescription(data.descripcion || "");
    };

    fetchDescription();
  }, [requirementId]);

  const handleSave = async () => {
    if (description === originalDescription) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const { error } = await supabase
        .from("requerimiento")
        .update({ descripcion: description })
        .eq("id", requirementId);

      if (error) throw error;

      toast({
        title: "Éxito",
        description: "Descripción actualizada correctamente",
      });

      setOriginalDescription(description);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      console.error("Error updating description:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la descripción",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDescription(originalDescription);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between items-center pb-2">
        <CardTitle>Descripción del requerimiento</CardTitle>
        {!isEditing ? (
          <Button size="icon" onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4" />
          </Button>
        ) : null}
      </CardHeader>
      <CustomSeparator />
      <CardContent className="pt-4">
        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] w-full p-2"
              placeholder="Escriba la descripción del requerimiento..."
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant={"outline"} onClick={handleCancel} disabled={isSaving}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar"}
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
