import type { UniqueIdentifier } from "@dnd-kit/core"; // Type for unique identifiers used for dragging.
import { useSortable } from "@dnd-kit/sortable"; // Hook to make an item sortable/draggable.
import NextLink from "next/link"; // Import Next.js Link
import { CSS } from "@dnd-kit/utilities"; // Utility to apply CSS transforms for dragging.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // UI components for Card structure.
import { Button } from "@/components/ui/button"; // Button component.
import { Separator } from "@/components/ui/separator"; // Optional: Separator component for layout separation.
import { cva } from "class-variance-authority"; // Utility for managing CSS class variants.
import { GripVertical } from "lucide-react"; // Icon used for the drag handle.
import { ColumnId } from "./KanbanBoard"; // Importing type for the column ID from the KanbanBoard.
import { MessageCircle, Link as LinkIcon, MoreVertical } from "lucide-react"; // Additional icons used in the task card layout.

export interface Task {
  id: UniqueIdentifier; // Unique identifier for the task (used by dnd-kit for drag-and-drop).
  columnId: ColumnId; // The ID of the column where the task is located.
  title: string; // The title of the task.
  content: string; // The content or description of the task.
}

interface TaskCardProps {
  task: Task; // Task data to be passed to the TaskCard component.
  isOverlay?: boolean; // Boolean to indicate whether this task card is part of a drag overlay.
}

export type TaskType = "Task"; // Type definition for a task.

export interface TaskDragData {
  type: TaskType; // Identifies the draggable item as a Task.
  task: Task; // The actual task data being dragged.
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

  return (
    <NextLink href="/login" passHref>
      <Card
        ref={setNodeRef} // Ref for the sortable card (dnd-kit uses this to manage the DOM node).
        style={style} // Apply the dragging transform and transition styles.
        className={variants({
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined, // Apply class variants based on whether the task is dragging or in overlay mode.
        })}
      >
        {/* Card Header with task title and drag handle */}
        <CardHeader className="px-3 py-3 flex flex-col space-y-2 pb-2 border-b-2 border-secondary">
          {/* First Row: Task Title and Drag Handle */}
          <div className="flex flex-row items-center justify-between w-full">
            {/* Task Title */}
            <CardTitle className="text-sm font-semibold">
              {task.title}
            </CardTitle>
            {/* A smaller font for task title */}

            {/* Button with drag handle (GripVertical icon) */}
            <Button
              variant={"ghost"} // Button with no background (ghost variant).
              {...attributes} // Accessibility attributes for the drag button (e.g., aria-label).
              {...listeners} // Drag listeners (onMouseDown, onTouchStart, etc.).
              className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab" // Styles for the drag handle button.
            >
              <span className="sr-only">Move task</span>{" "}
              {/* Screen-reader only label */}
              <GripVertical />{" "}
              {/* Icon for drag handle (vertical grip lines) */}
            </Button>
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
                <MessageCircle className="h-4 w-4" /> {/* Icon for comments */}
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
    </NextLink>
  );
}
