// components/custom/Overview/Kanban/TodoList.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from '@/utils/supabase/client';
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import CustomSeparator from "../../CustomSeparator";
import { Plus, Trash2 } from "lucide-react";

interface TodoItem {
  id: number;
  content: string;
  status: 'todo' | 'done';
}

interface TodoListProps {
  requirementId: string;
}

export function TodoList({ requirementId }: TodoListProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodoContent, setNewTodoContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch todos
  useEffect(() => {
    const fetchTodos = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('todo_list')
        .select('*')
        .eq('requerimiento_id', requirementId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching todos:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las tareas",
          variant: "destructive",
        });
        return;
      }

      setTodos(data || []);
      setIsLoading(false);
    };

    fetchTodos();
  }, [requirementId]);

  // Add new todo
  const handleAddTodo = async () => {
    if (!newTodoContent.trim()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('todo_list')
      .insert([
        {
          content: newTodoContent.trim(),
          requerimiento_id: requirementId,
          status: 'todo'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la tarea",
        variant: "destructive",
      });
      return;
    }

    setTodos([...todos, data]);
    setNewTodoContent('');
    toast({
      title: "Éxito",
      description: "Tarea agregada correctamente",
    });
  };

  // Toggle todo status
  const handleToggleTodo = async (todoId: number, currentStatus: 'todo' | 'done') => {
    const newStatus = currentStatus === 'todo' ? 'done' : 'todo';
    const supabase = createClient();
    
    const { error } = await supabase
      .from('todo_list')
      .update({ status: newStatus })
      .eq('id', todoId);

    if (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la tarea",
        variant: "destructive",
      });
      return;
    }

    setTodos(todos.map(todo => 
      todo.id === todoId ? { ...todo, status: newStatus } : todo
    ));
  };

  // Delete todo
  const handleDeleteTodo = async (todoId: number) => {
    const supabase = createClient();
    
    const { error } = await supabase
      .from('todo_list')
      .delete()
      .eq('id', todoId);

    if (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive",
      });
      return;
    }

    setTodos(todos.filter(todo => todo.id !== todoId));
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
        <CardTitle>Lista de Tareas</CardTitle>
      </CardHeader>
      <CustomSeparator />
      <CardContent className="pt-4">
        {/* Add new todo */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nueva tarea..."
            value={newTodoContent}
            onChange={(e) => setNewTodoContent(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddTodo();
              }
            }}
          />
          <Button
            onClick={handleAddTodo}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Todo list */}
        <div className="space-y-2">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={todo.status === 'done'}
                  onCheckedChange={() => handleToggleTodo(todo.id, todo.status)}
                  className="h-4 w-4"
                />
                <span className={todo.status === 'done' ? 'line-through text-gray-500' : ''}>
                  {todo.content}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTodo(todo.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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