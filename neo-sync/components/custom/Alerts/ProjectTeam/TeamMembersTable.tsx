import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Users, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import BlueButton from "../../BlueButton";

interface TeamMember {
  id: number;
  rol: string;
  experiencia: string;
  proyecto_id: string;
}

interface TeamMembersTableProps {
  projectId: string;
}

export function TeamMembersTable({ projectId }: TeamMembersTableProps) {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState({
    rol: "",
    experiencia: "",
  });

  const fetchTeamMembers = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("equipo_proyecto")
      .select("*")
      .eq("proyecto_id", projectId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el equipo del proyecto",
        variant: "destructive",
      });
      return;
    }

    setTeamMembers(data || []);
  };

  useEffect(() => {
    fetchTeamMembers();
  }, [projectId]);

  const handleAddMember = async () => {
    if (!newMember.rol || !newMember.experiencia) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      });
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("equipo_proyecto").insert([
      {
        proyecto_id: projectId,
        rol: newMember.rol,
        experiencia: newMember.experiencia,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Miembro agregado al equipo correctamente",
    });

    fetchTeamMembers();
    setNewMember({ rol: "", experiencia: "" });
  };

  const handleDeleteMember = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("equipo_proyecto")
      .delete()
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el miembro del equipo",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Éxito",
      description: "Miembro eliminado del equipo correctamente",
    });

    fetchTeamMembers();
  };

  return (
    <BlueButton text="Equipo del Proyecto" icon={<Users className="h-4 w-4" />}>
      <AlertDialogHeader className="relative">
        <AlertDialogCancel className="absolute -right-3 -top-3 p-2 hover:bg-transparent border-0 shadow-none">
          <X className="h-4 w-4" />
        </AlertDialogCancel>
        <AlertDialogTitle>Equipo del Proyecto</AlertDialogTitle>
        <AlertDialogDescription>
          <div className="space-y-4">
            {/* Add Member Button */}
            <div className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Miembro
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Agregar Miembro al Equipo</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Rol</label>
                          <Select
                            onValueChange={(value) =>
                              setNewMember({ ...newMember, rol: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="developer">Desarrollador</SelectItem>
                              <SelectItem value="ui_ux">UI/UX Designer</SelectItem>
                              <SelectItem value="scrum_master">Scrum Master</SelectItem>
                              <SelectItem value="qa">QA Engineer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Experiencia</label>
                          <Select
                            onValueChange={(value) =>
                              setNewMember({ ...newMember, experiencia: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar experiencia" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="junior">Junior</SelectItem>
                              <SelectItem value="mid">Mid-Level</SelectItem>
                              <SelectItem value="senior">Senior</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleAddMember}>
                      Agregar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Rol</TableHead>
                  <TableHead>Experiencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      {member.rol === 'developer' && 'Desarrollador'}
                      {member.rol === 'ui_ux' && 'UI/UX Designer'}
                      {member.rol === 'scrum_master' && 'Scrum Master'}
                      {member.rol === 'qa' && 'QA Engineer'}
                    </TableCell>
                    <TableCell>
                      {member.experiencia === 'junior' && 'Junior'}
                      {member.experiencia === 'mid' && 'Mid-Level'}
                      {member.experiencia === 'senior' && 'Senior'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
    </BlueButton>
  );
}