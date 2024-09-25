import { SortableContext, useSortable } from "@dnd-kit/sortable"; // Hooks for sortable functionality from dnd-kit.
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core"; // Core hooks from dnd-kit and UniqueIdentifier type.
import { CSS } from "@dnd-kit/utilities"; // Utilities from dnd-kit to apply CSS transforms for draggable elements.
import { useMemo } from "react"; // React hook for memoizing values (optimizes performance).
import { Task, TaskCard } from "./TaskCard"; // Custom Task type and TaskCard component.
import { cva } from "class-variance-authority"; // Utility to handle variants of CSS classes.
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // UI components (Card) from your project.
import { Button } from "@/components/ui/button"; // Button component from your project.
import { GripVertical } from "lucide-react"; // Icon component from Lucide-React (used for the grip/drag handle).
import { ScrollArea } from "@/components/ui/scroll-area"; // Scrollable area component from your project.

export interface Column {
  id: UniqueIdentifier; // Each column has a unique identifier.
  title: string; // The title of the column (e.g., "Todo", "In Progress").
}

export type ColumnType = "Column"; // Type definition for the column (used in drag data).

export interface ColumnDragData {
  type: ColumnType; // Identifies the type of draggable item (a column).
  column: Column; // The column data itself.
}

interface BoardColumnProps {
  column: Column; // The column information (id, title).
  tasks: Task[]; // Array of tasks within this column.
  isOverlay?: boolean; // Flag to check if this is a drag overlay.
}

// The BoardColumn component represents a single column in the Kanban board.
export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  // Memoize task IDs for performance optimization (tasksIds won't recalculate unless tasks change).
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id); // Return an array of task IDs.
  }, [tasks]);

  // Hook for sorting the column (draggable behavior).
  const {
    setNodeRef, // Sets the reference to the DOM node for the sortable item.
    attributes, // Provides accessibility attributes for the sortable item.
    listeners, // Provides event listeners for drag start (e.g., mouse down, touch).
    transform, // The transformation applied during drag (e.g., move X, move Y).
    transition, // Transition applied during the drag (e.g., smooth dragging).
    isDragging, // Boolean flag to check if the column is currently being dragged.
  } = useSortable({
    id: column.id, // The unique identifier for this column (used in drag-and-drop context).
    data: {
      type: "Column", // Identifies this as a draggable column.
      column, // The column data (id and title).
    } satisfies ColumnDragData, // Type-safety check for the column drag data.
    attributes: {
      roleDescription: `Column: ${column.title}`, // Accessibility attribute to describe the column's role.
    },
  });

  // Define styles for the column's drag transformation and transition.
  const style = {
    transition, // The transition effect applied during drag.
    transform: CSS.Translate.toString(transform), // Convert the transform object to a CSS string (e.g., translateX, translateY).
  };

  // Class variants for different drag states (e.g., default, over, overlay).
  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent", // Default state with transparent border.
          over: "ring-2 opacity-30", // When dragging over, show a ring and reduce opacity.
          overlay: "ring-2 ring-primary", // Show a ring when the column is in the overlay state.
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef} // Ref for the sortable column (so dnd-kit can control the DOM node).
      style={style} // Apply the drag styles (transition and transform).
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined, // Apply different styles based on dragging state.
      })}
    >
      {/* Header of the column */}
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        {/* 
        Optional drag handle for the column (currently commented out).
        This would allow the column to be dragged by clicking the button with the GripVertical icon.
        */}
        {/* <Button
          variant={"ghost"}
          {...attributes} // Accessibility attributes for drag.
          {...listeners} // Event listeners for drag start.
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span> // Screen reader text.
          <GripVertical /> // Drag handle icon.
        </Button> */}
        <span>{column.title}</span>{" "}
        {/* Display the title of the column (e.g., "Todo"). */}
      </CardHeader>
      <ScrollArea>
        {/* Content of the column (tasks). */}
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {/* Render each task inside the column using TaskCard component. */}
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

// The BoardContainer component wraps the columns in a scrollable area.
export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext(); // Access the global drag-and-drop context.

  // Class variants for scrolling and snapping behavior based on dragging state.
  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory", // Default behavior with snapping for smooth scrolling.
        active: "snap-none", // Disable snapping while dragging.
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default", // Change scrolling behavior based on drag state.
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {/* Render the columns passed as children. */}
        {children}
      </div>
    </ScrollArea>
  );
}
