"use client";

import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import NextLink from "next/link";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { MessageCircle, Link as LinkIcon, Clock } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import TaskCardDrawer from "./Sheet/TaskCardDrawer";
import { CheckSquare } from "lucide-react";
import { createClient } from '@/utils/supabase/client';

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  title: string;
  content: string;
  fecha_inicio?: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  const [todoCounts, setTodoCounts] = useState({ total: 0, completed: 0 });
  const [projectStartDate, setProjectStartDate] = useState<string | null>(null);
  const router = useRouter();
  const currentPath = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check if we're in a project's requirements view
  const isInProjectRequirements = currentPath?.includes('/projects/');

  // Check if we're in projects view
  const isInProjects = currentPath === "/projects";

  // Fetch project start date if we're in projects view
  const fetchProjectStartDate = async () => {
    if (!isInProjects) return;

    console.log('Fetching project start date for task:', task.id);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('proyecto')
      .select('fecha_inicio')
      .eq('id', task.id)
      .single();

    if (error) {
      console.error('Error fetching project start date:', error);
      return;
    }

    if (data) {
      console.log('Received project start date:', data.fecha_inicio);
      setProjectStartDate(data.fecha_inicio);
    }
  };

  // Only fetch todo counts if we're in a project's requirements view
  const fetchTodoCounts = async () => {
    if (!isInProjectRequirements) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from('todo_list')
      .select('status')
      .eq('requerimiento_id', task.id);

    if (error) {
      console.error('Error fetching todo counts:', error);
      return;
    }

    const total = data.length;
    const completed = data.filter(todo => todo.status === 'done').length;
    setTodoCounts({ total, completed });
  };

  // Set up effects for different views
  useEffect(() => {
    if (isInProjects) {
      fetchProjectStartDate();
      
      // Set up real-time subscription for project dates
      const supabase = createClient();
      const channel = supabase
        .channel(`project-date-${task.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'proyecto',
          filter: `id=eq.${task.id}`
        }, (payload) => {
          console.log('Received real-time update for project:', payload);
          fetchProjectStartDate();
        })
        .subscribe();

      return () => {
        console.log('Cleaning up project subscription');
        supabase.removeChannel(channel);
      };
    } else if (isInProjectRequirements) {
      fetchTodoCounts();
      
      const supabase = createClient();
      const channel = supabase
        .channel(`todo-changes-${task.id}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'todo_list',
          filter: `requerimiento_id=eq.${task.id}`
        }, () => {
          fetchTodoCounts();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [task.id, isInProjects, isInProjectRequirements]);

  const handleClick = () => {
    if (currentPath === "/projects") {
      router.push("/projects/" + task.id);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const calculateDaysSinceStart = () => {
    const dateToUse = isInProjects ? projectStartDate : task.fecha_inicio;
    if (!dateToUse || !isInProjects) return null;
    
    // Create dates using YYYY-MM-DD format to avoid timezone issues
    const [year, month, day] = dateToUse.split('-').map(Number);
    const startDate = new Date(year, month - 1, day); // month is 0-based in JS
    
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    
    // Only log if we're in projects view
    if (isInProjects) {
      console.log('Start date (local):', startDate.toLocaleDateString());
      console.log('Today (local):', today.toLocaleDateString());
    }
    
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (isInProjects) {
      console.log('Difference in days:', diffDays);
    }
    return diffDays;
  };

  // Only show the indicator in projects view
  const renderProgressIndicator = () => {
    if (!isInProjects) return null;
    
    const daysDiff = calculateDaysSinceStart();
    if (daysDiff === null) return null;

    // For future dates, daysDiff will be positive
    // For past dates, daysDiff will be negative
    const isStarted = daysDiff <= 0;
    const daysToShow = Math.abs(daysDiff);
    
    return (
      <div className="flex items-center space-x-1">
        <Clock className="h-4 w-4" />
        <span className="text-sm">
          {isStarted 
            ? `Dia ${daysToShow + 1}` 
            : daysToShow === 1 ? `Empieza en ${daysToShow} día` : `Empieza en ${daysToShow} días`
          }
        </span>
        {isStarted && (
          <div className="w-12 h-1.5 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, ((daysToShow + 1) / 5) * 100)}%`,
                backgroundColor: (daysToShow + 1) > 5 ? '#ef4444' : '#3b82f6'
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div onClick={handleClick}>
        <Card
          ref={setNodeRef}
          style={style}
          className={
            variants({
              dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
            }) + " cursor-pointer"
          }
        >
          <CardHeader className="px-3 py-3 flex flex-col space-y-2 pb-2 border-b-2 border-secondary">
            <div className="flex flex-row items-center justify-between w-full">
              <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
            </div>
            <p className="text-sm text-gray-500">{task.content}</p>
          </CardHeader>

          <CardContent className="px-3 pt-3 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
               
                {isInProjectRequirements && (
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4" />
                    <span className="text-sm">
                      {todoCounts.completed}/{todoCounts.total}
                    </span>
                  </div>
                )}
                {/* {isInProjects && renderProgressIndicator()} */}
              </div>

              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>
                <div className="h-6 w-6 rounded-full bg-gray-400"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {isDrawerOpen && (
        <TaskCardDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          requirementId={task.id as string}
          onTodoCountsChange={setTodoCounts}
        />
      )}
    </div>
  );
}