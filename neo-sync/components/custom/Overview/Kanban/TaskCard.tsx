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
import { MessageCircle, Link as LinkIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import TaskCardDrawer from "./Sheet/TaskCardDrawer";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  title: string;
  content: string;
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

// TaskCard component that renders a task and makes it draggable using dnd-kit.
export function TaskCard({ task, isOverlay }: TaskCardProps) {
  // Hook from @dnd-kit/sortable to make the task draggable and sortable.
  const {
    setNodeRef, // Ref for the DOM node to make it sortable.
    attributes, // Accessibility attributes (like aria-label) for the draggable item.
    listeners, // Event listeners to initiate drag (e.g., onMouseDown).
    transform, // CSS transform to apply during drag (e.g., translateX, translateY).
    transition, // CSS transition for smooth dragging.
    isDragging, // Boolean to determine if the task is currently being dragged.
  } = useSortable({
    id: task.id, // The unique identifier for the task, used for sorting and dragging.
    data: {
      type: "Task", // Indicates that this draggable item is a Task.
      task, // The task data being passed to the drag context.
    } satisfies TaskDragData, // Ensures the data matches the TaskDragData type.
    attributes: {
      roleDescription: "Task", // Accessibility attribute to describe the role of the draggable element.
    },
  });

  // Styles for the task card, applying transform and transition during drag.
  const style = {
    transition, // Smooth transitions during drag-and-drop.
    transform: CSS.Translate.toString(transform), // Applies the drag transform (translateX, translateY).
  };

  // Class variants to change the appearance of the task card based on its state (dragging, overlay).
  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30", // When being dragged over another element, apply opacity and ring.
        overlay: "ring-2 ring-primary", // When part of an overlay, show a primary-colored ring.
      },
    },
  });

  //* Logic for chaning paths
  const router = useRouter();
  const currentPath = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleClick = () => {
    if (currentPath === "/projects") {
      // Navigate to /projects/1 if the route is /projects
      router.push("/projects/" + task.id);
    } else if (currentPath === "/projects" + ) {

    } else {
      // Open the RightSideDrawer if the route is /projects/something
      setIsDrawerOpen(true);
    }
  };

  return (
    <div>
      <div onClick={handleClick}>
        <Card
          ref={setNodeRef}
          style={style}
          className={
            variants({
              dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined, // Apply class variants based on whether the task is dragging or in overlay mode.
            }) + " cursor-pointer"
          }
        >
          {/* Card Header with task title and drag handle */}
          <CardHeader className="px-3 py-3 flex flex-col space-y-2 pb-2 border-b-2 border-secondary">
            {/* First Row: Task Title and Drag Handle */}
            <div className="flex flex-row items-center justify-between w-full">
              {/* Task Title */}
              <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
              {/* A smaller font for task title */}
            </div>

            {/* Second Row: Task Content (description) */}
            <p className="text-sm text-gray-500">{task.content}</p>
            {/* A smaller font and gray color for task content/description */}
          </CardHeader>

          {/* Remaining Card Content (additional task info) */}
          <CardContent className="px-3 pt-3 pb-6 space-y-4">
            <div className="flex items-center justify-between">
              {/* Section for icons and counts */}
              <div className="flex space-x-4">
                {/* Comments count with icon */}
                <div className="flex items-center space-x-1">
                  <MessageCircle className="h-4 w-4" />{" "}
                  {/* Icon for comments */}
                  <span className="text-sm">20</span> {/* Number of comments */}
                </div>
                {/* Links count with icon */}
                <div className="flex items-center space-x-1">
                  <LinkIcon className="h-4 w-4" /> {/* Icon for links */}
                  <span className="text-sm">5</span> {/* Number of links */}
                </div>
              </div>

              {/* Section for avatars (team members) */}
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full bg-gray-300"></div>{" "}
                {/* Smaller avatar placeholder */}
                <div className="h-6 w-6 rounded-full bg-gray-400"></div>{" "}
                {/* Smaller avatar placeholder */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {isDrawerOpen && (
        <TaskCardDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </div>
  );
}
