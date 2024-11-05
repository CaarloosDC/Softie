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
import { SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from '@/hooks/use-toast';

interface DeleteProjectProps {
  projectId: string;
}

const DeleteProject: React.FC<DeleteProjectProps> = ({ projectId }) => {
  const router = useRouter();
  
  const handleDelete = async () => {
    try {
      const supabase = createClient();
      
      // First, delete all requirements associated with the project
      const { error: requirementsError } = await supabase
        .from('requerimiento')
        .delete()
        .eq('proyecto_id', projectId);
      
      if (requirementsError) {
        throw requirementsError;
      }

      // Then, delete the project
      const { error: projectError } = await supabase
        .from('proyecto')
        .delete()
        .eq('id', projectId);
      
      if (projectError) {
        throw projectError;
      }

      toast({
        title: "Project deleted",
        description: "The project and all its requirements have been successfully deleted.",
      });

      // Redirect to the projects page
      router.push('/projects');
      router.refresh();
      
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: error instanceof Error 
          ? error.message 
          : "There was a problem deleting the project and its requirements.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="bg-red-600 hover:bg-red-700 text-white hover:text-white rounded-md px-4 py-2 text-sm font-medium flex items-center"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminarán permanentemente el proyecto
            y todos los requerimientos asociados.
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

export default DeleteProject;