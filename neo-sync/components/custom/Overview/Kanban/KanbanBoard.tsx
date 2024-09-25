"use client"; // This directive ensures the component runs on the client side (important for Next.js components).

import { useMemo, useRef, useState, useEffect } from "react"; // React hooks for state management and side effects.
import { createPortal } from "react-dom"; // Used to render the drag overlay in a different DOM subtree.

import { BoardColumn, BoardContainer } from "./BoardColumn"; // Custom components for the Kanban board columns and container.
import {
  DndContext, // Context provider from @dnd-kit/core to handle drag-and-drop functionality.
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay, // Component to show what is being dragged.
  type DragStartEvent,
  useSensor, // Hook for defining a specific drag sensor.
  useSensors, // Hook to combine multiple drag sensors.
  KeyboardSensor, // Sensor for keyboard-based drag functionality.
  Announcements, // For accessibility; announcements during drag events.
  UniqueIdentifier, // Type for unique identifiers.
  TouchSensor, // Sensor for touch-based dragging.
  MouseSensor, // Sensor for mouse-based dragging.
} from "@dnd-kit/core"; // Core drag-and-drop functionality.
import { SortableContext, arrayMove } from "@dnd-kit/sortable"; // Components for sortable functionality, arrayMove reorders items.
import { type Task, TaskCard } from "./TaskCard"; // Custom components for task cards.
import type { Column } from "./BoardColumn"; // Type for columns.
import { hasDraggableData } from "./utils"; // Utility function to check if drag event has draggable data.
import { coordinateGetter } from "./multipleContainersKeyboardPreset"; // Custom function for handling keyboard-based drag coordinates.

const defaultCols = [
  {
    id: "todo" as const,
    title: "Pendientes",
  },
  {
    id: "in-progress" as const,
    title: "En progreso",
  },
  {
    id: "done" as const,
    title: "Aprobados",
  },
] satisfies Column[]; // Initial columns for the Kanban board, with titles like "Pendientes", "En progreso", etc.

export type ColumnId = (typeof defaultCols)[number]["id"]; // Type for column IDs based on the default columns.

const initialTasks: Task[] = [
  // Initial tasks to populate the Kanban board.
  // Each task has an id, a columnId to indicate its column, a title, and content.
  {
    id: "task1",
    columnId: "done",
    title: "Project Kickoff",
    content: "Project initiation and planning",
  },
  // ... (other tasks are listed similarly)
];

export function KanbanBoard() {
  // State for managing columns and tasks.
  const [columns, setColumns] = useState<Column[]>(defaultCols); // Keeps track of all the columns.
  const pickedUpTaskColumn = useRef<ColumnId | null>(null); // Reference to keep track of which column a task was picked from.
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]); // Memoized array of column IDs for performance optimization.

  const [tasks, setTasks] = useState<Task[]>(initialTasks); // Keeps track of tasks.
  const [activeColumn, setActiveColumn] = useState<Column | null>(null); // Tracks the active column being dragged.
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Tracks the active task being dragged.

  // State to check if component is running in the client (important for Next.js to avoid server-side rendering errors with window/document).
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true); // Ensures the window/document is accessible after mounting.
  }, []);

  // Configuring different drag-and-drop sensors (mouse, touch, and keyboard).
  const sensors = useSensors(
    useSensor(MouseSensor), // Mouse-based dragging.
    useSensor(TouchSensor), // Touch-based dragging.
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter, // Handles keyboard dragging coordinates.
    })
  );

  // Helper function to get task data when dragging.
  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId); // Get all tasks in the same column.
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId); // Get the index of the dragged task in the column.
    const column = columns.find((col) => col.id === columnId); // Find the column where the task belongs.
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  // Accessibility announcements to describe what's happening during drag events (e.g., "Picked up Task X at position Y").
  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id); // Get the index of the column being dragged.
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`; // Announce column drag start.
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.columnId; // Store the column ID of the task being picked up.
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${
          active.data.current.task.content
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`; // Announce task drag start.
      }
    },
    onDragOver({ active, over }) {
      // Handles the announcement when the dragged item is moved over another item.
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.content
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      // Handles what happens when a drag ends.
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);
        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`; // Announce column drop.
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.columnId
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`; // Announce drag cancellation.
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements, // Adding the accessibility announcements.
      }}
      sensors={sensors} // Adding the drag sensors.
      onDragStart={onDragStart} // Handler for drag start.
      onDragEnd={onDragEnd} // Handler for drag end.
      onDragOver={onDragOver} // Handler for drag over.
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.columnId === col.id)} // Filtering tasks by their column.
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {/* Creating the drag overlay that appears when dragging a task/column */}
      {isClient &&
        "document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column); // Set active column when dragging starts.
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task); // Set active task when dragging starts.
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null); // Clear active column after dragging ends.
    setActiveTask(null); // Clear active task after dragging ends.

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex); // Reorder columns when drag ends.
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Handle when dragging a task over another task.
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId; // Move task to a new column if dropped in a different column.
          return arrayMove(tasks, activeIndex, overIndex - 1); // Reorder tasks within the new column.
        }

        return arrayMove(tasks, activeIndex, overIndex); // Reorder tasks within the same column.
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Handle when dragging a task over a column (not another task).
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as ColumnId; // Update the task's column if dropped over a column.
          return arrayMove(tasks, activeIndex, activeIndex); // Reorder within the same column.
        }
        return tasks;
      });
    }
  }
}
