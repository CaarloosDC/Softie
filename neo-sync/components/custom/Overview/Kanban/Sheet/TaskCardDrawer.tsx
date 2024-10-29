import { Sheet, SheetContent } from "@/components/ui/sheet";
import { EstimationsCard } from "./EstimationsCard";
import { RequirementDescription } from "./RequirementDescription";
import { useEffect, useState } from "react";
import { Estimation } from "@/types/types";
import { createClient } from '@/utils/supabase/client';

interface TaskCardDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  requirementId: string;
}

export default function TaskCardDrawer({
  isOpen,
  onClose,
  requirementId,
}: TaskCardDrawerProps) {
  const [estimationData, setEstimationData] = useState<Estimation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEstimationData = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('requerimiento')
        .select('esfuerzo_requerimiento, tiempo_requerimiento, costo_requerimiento')
        .eq('id', requirementId)
        .single();

      if (error) {
        console.error('Error fetching estimation data:', error);
        setIsLoading(false);
        return;
      }

      setEstimationData({
        ...data,
        requerimiento_id: requirementId
      });
      setIsLoading(false);
    };

    if (isOpen && requirementId) {
      fetchEstimationData();
    }
  }, [isOpen, requirementId]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full max-w-[100vw] sm:max-w-[100vw] lg:max-w-[50vw] p-2 flex flex-col h-full"
      >
        {/* Add RequirementDescription at the top */}
        <div className="flex-grow overflow-y-auto space-y-6">
          <RequirementDescription requirementId={requirementId} />
          
          {/* Chat section */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Chat</h2>
            <p>Teams.</p>
          </div>

          {/* Estimations section */}
          {isLoading ? (
            <div>Loading estimation data...</div>
          ) : (
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