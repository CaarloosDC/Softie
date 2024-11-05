import React from 'react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DeleteRequirementProps {
  requirementId: string;
  onDelete?: () => void;
}

const DeleteRequirement: React.FC<DeleteRequirementProps> = ({ 
  requirementId,
  onDelete 
}) => {
  const router = useRouter();
  
  const handleDelete = async () => {
    try {
      const supabase = createClient();
      
      // First delete all todos associated with the requirement
      const { error: todosError } = await supabase
        .from('todo_list')
        .delete()
        .eq('requerimiento_id', requirementId);
      
      if (todosError) {
        throw todosError;
      }

      // Then delete the requirement
      const { error: requirementError } = await supabase
        .from('requerimiento')
        .delete()
        .eq('id', requirementId);
      
      if (requirementError) {
        throw requirementError;
      }

      toast({
        title: "Requerimiento eliminado",
        description: "El requerimiento y sus tareas han sido eliminados exitosamente.",
      });

      // Call onDelete callback if provided
      if (onDelete) {
        onDelete();
      }

      router.refresh();
      
    } catch (error) {
      console.error('Error deleting requirement:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "Hubo un problema al eliminar el requerimiento y sus tareas.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente el requerimiento
            y todas las tareas asociadas.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRequirement;