// components/custom/Overview/Kanban/TodoList.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/utils/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CustomSeparator from "../../CustomSeparator";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface TodoCounts {
  total: number;
  completed: number;
}

interface TodoItem {
  id: number;
  content: string;
  status: "todo" | "done";
}

interface TodoListProps {
  requirementId: string;
  onTodoCountsChange?: (counts: TodoCounts) => void;
}

export function TodoList({ requirementId, onTodoCountsChange }: TodoListProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoContent, setNewTodoContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [todoToDelete, setTodoToDelete] = useState<TodoItem | null>(null);

  const updateRequirementStatus = async (todosList: TodoItem[]) => {
    // Update requirement status logic
  };

  const updateStatus = async (status: string) => {
    // Update status in database
  };

  const updateTodoCounts = (todosList: TodoItem[]) => {
    const total = todosList.length;
    const completed = todosList.filter((todo) => todo.status === "done").length;
    if (onTodoCountsChange) {
      onTodoCountsChange({ total, completed });
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("todo_list")
        .select("*")
        .eq("requerimiento_id", requirementId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching todos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas",
          variant: "destructive",
        });
        return;
      }

      setTodos(data || []);
      updateRequirementStatus(data || []);
      updateTodoCounts(data || []);
      setIsLoading(false);
    };

    fetchTodos();
  }, [requirementId]);

  const handleAddTodo = async () => {
    if (!newTodoContent.trim()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("todo_list")
      .insert([
        {
          content: newTodoContent.trim(),
          requerimiento_id: requirementId,
          status: "todo",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
      toast({
        title: "Error",
        description: "No se pudo agregar la tarea",
        variant: "destructive",
      });
      return;
    }

    const newTodos = [...todos, data];
    setTodos(newTodos);
    updateRequirementStatus(newTodos);
    updateTodoCounts(newTodos);
    setNewTodoContent("");
    toast({
      title: "Éxito",
      description: "Tarea agregada correctamente",
    });
  };

  const handleToggleTodo = async (
    todoId: number,
    currentStatus: "todo" | "done"
  ) => {
    const newStatus = currentStatus === "todo" ? "done" : "todo";

    const supabase = createClient();

    const { error } = await supabase
      .from("todo_list")
      .update({ status: newStatus })
      .eq("id", todoId);

    if (error) {
      console.error("Error updating todo:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea",
        variant: "destructive",
      });
      return;
    }

    const updatedTodos = todos.map((todo) =>
      todo.id === todoId
        ? { ...todo, status: newStatus as "todo" | "done" }
        : todo
    );
    setTodos(updatedTodos);
    updateRequirementStatus(updatedTodos);
    updateTodoCounts(updatedTodos);
  };

  const handleDeleteTodo = async () => {
    if (!todoToDelete) return;

    const supabase = createClient();

    const { error } = await supabase
      .from("todo_list")
      .delete()
      .eq("id", todoToDelete.id);

    if (error) {
      console.error("Error deleting todo:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive",
      });
      return;
    }

    const updatedTodos = todos.filter((todo) => todo.id !== todoToDelete.id);
    setTodos(updatedTodos);
    updateRequirementStatus(updatedTodos);
    updateTodoCounts(updatedTodos);
    setTodoToDelete(null);
    toast({
      title: "Éxito",
      description: "Tarea eliminada correctamente",
    });
  };

  if (isLoading) {
    return <div>Loading todos...</div>;
  }

  return (
    <Card className="w-full mt-4">
      <CardHeader className="pb-2">
        <CardTitle>Lista de tareas</CardTitle>
      </CardHeader>
      <CustomSeparator />
      <CardContent className="pt-4">
        {/* Add new todo */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nueva tarea..."
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleAddTodo();
              }
            }}
          />
          <Button size={"sm"} onClick={handleAddTodo}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-start justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-start gap-2 min-w-0 mr-2 flex-1">
                <Checkbox
                  checked={todo.status === "done"}
                  onCheckedChange={() => handleToggleTodo(todo.id, todo.status)}
                  className="h-4 w-4 mt-1 flex-shrink-0"
                />
                <span
                  className={cn(
                    "break-all pr-2",
                    todo.status === "done" ? "line-through text-gray-500" : ""
                  )}
                >
                  {todo.content}
                </span>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTodoToDelete(todo)}
                    className="text-red-500 hover:text-red-700 flex-shrink-0 ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
                  </AlertDialogHeader>
                  <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        onClick={handleDeleteTodo}
                        className="bg-red-500 text-white"
                      >
                        Eliminar
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          {todos.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              No hay tareas agregadas
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
