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
  const router = useRouter();
  const currentPath = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Check if we're in a project's requirements view
  const isInProjectRequirements = currentPath?.includes('/projects/');

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

  // Only set up subscription if we're in a project's requirements view
  useEffect(() => {
    if (!isInProjectRequirements) return;

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
  }, [task.id, isInProjectRequirements]);

  const handleClick = () => {
    if (currentPath === "/projects") {
      router.push("/projects/" + task.id);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const calculateDaysSinceStart = () => {
    if (!task.fecha_inicio) return 0;
    
    const startDate = new Date(task.fecha_inicio);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderProgressIndicator = () => {
    const days = calculateDaysSinceStart();
    return (
      <div className="flex items-center space-x-1" title={`Days since start: ${days}`}>
        <Clock className="h-4 w-4" />
        <span className="text-sm">{days}/5</span>
        <div className="w-12 h-1.5 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ 
              width: `${Math.min(100, (days / 5) * 100)}%`,
              backgroundColor: days > 5 ? '#ef4444' : '#3b82f6'
            }}
          />
        </div>
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
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm">20</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon className="h-4 w-4" />
                  <span className="text-sm">5</span>
                </div>
                {isInProjectRequirements && (
                  <div className="flex items-center space-x-1">
                    <CheckSquare className="h-4 w-4" />
                    <span className="text-sm">
                      {todoCounts.completed}/{todoCounts.total}
                    </span>
                  </div>
                )}
                {task.fecha_inicio && renderProgressIndicator()}
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