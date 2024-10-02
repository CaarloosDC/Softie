"use client"; // Ensures running on client

import { useMemo, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom"; // Used to render the drag overlay in a different DOM subtree.
import {
  DndContext, // Context provider from @dnd-kit/core to handle drag-and-drop
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
import { hasDraggableData } from "./utils"; // Utility function to check if drag event has draggable data.
import { coordinateGetter } from "./multipleContainersKeyboardPreset"; // Custom function for handling keyboard drag coordinates.
import type { Column } from "./BoardColumn"; // Type for columns.
import { BoardColumn, BoardContainer } from "./BoardColumn";
import { type Task, TaskCard } from "./TaskCard";

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
] satisfies Column[]; // Initial columns for the Kanban board

export type ColumnId = (typeof defaultCols)[number]["id"]; // Type for column IDs based on the default columns.

export function KanbanBoard({ data }: { data: Task[] }) {
  // State for managing columns and tasks.
  const [columns, setColumns] = useState<Column[]>(defaultCols); // Keeps track of all the columns.
  const pickedUpTaskColumn = useRef<ColumnId | null>(null); // Reference to keep track of which column a task was picked from.
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]); // Memoized array of column IDs for performance.

  const [tasks, setTasks] = useState<Task[]>(data); // All tasks.
  // const [activeColumn, setActiveColumn] = useState<Column | null>(null); // Tracks the active column being dragged.
  const [activeTask, setActiveTask] = useState<Task | null>(null); // Tracks the task being dragged.

  // State to check if component is running in the client.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Configuring different drag-and-drop sensors (mouse, touch, and keyboard).
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter, // Keyboard dragging coordinates.
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
      // Manages all draggable and droppable components.
      accessibility={{
        announcements, // Accessibility for users using screen readers.
      }}
      sensors={sensors} // Specifies sensors for drag-and-drop actions.
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        {/* SortableContext wraps the draggable items (columns in this case), allowing them to be reordered via drag-and-drop */}
        {/* <SortableContext items={columnsId}> */}
        {columns.map((col) => (
          <BoardColumn
            key={col.id} // Unique key for each column (based on its ID).
            column={col} // Passes the column data (like title, id) to the BoardColumn component.
            tasks={tasks.filter((task) => task.columnId === col.id)} // Passes the tasks that belong to the current column.
          />
        ))}
        {/* </SortableContext> */}
      </BoardContainer>

      {/* Drag overlay is created here, which follows the dragged item visually while dragging. */}
      {isClient &&
        "document" in window && // Ensures this is running on the client-side to prevent issues during server-side rendering.
        createPortal(
          <DragOverlay>
            {/* If a column is being dragged, show BoardColumn as an overlay */}
            {/* {activeColumn && (
              <BoardColumn
                isOverlay // Indicates this is a visual overlay and not the actual column in its place.
                column={activeColumn} // The column data (like title) being dragged.
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id // Filters the tasks that belong to the dragged column.
                )}
              />
            )} */}
            {/* If a task is being dragged, show the TaskCard as an overlay */}
            {activeTask && <TaskCard task={activeTask} isOverlay />}
          </DragOverlay>,
          document.body // The drag overlay is rendered in the document body, not inside the container, to ensure smooth dragging.
        )}
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    // Check if the active draggable item has valid data (either a task or a column).
    if (!hasDraggableData(event.active)) return;

    const data = event.active.data.current; // Get the current data associated with the active draggable item.

    // If the active item is a column, set it as the active column for dragging.
    // if (data?.type === "Column") {
    //   setActiveColumn(data.column); // Set active column when dragging starts.
    //   return; // Stop further execution since the column is being handled.
    // }

    // If the active item is a task, set it as the active task for dragging.
    if (data?.type === "Task") {
      setActiveTask(data.task); // Set active task when dragging starts.
      return; // Stop further execution since the task is being handled.
    }
  }

  function onDragEnd(event: DragEndEvent) {
    // Clear the active column and task after dragging ends.
    // setActiveColumn(null); // Clear active column.
    setActiveTask(null); // Clear active task.

    const { active, over } = event; // Destructure active and over (the item being dragged over) from the event.
    if (!over) return; // If there's no "over" item (where the draggable was dropped), return early.

    const activeId = active.id; // Get the unique ID of the active draggable item.
    const overId = over.id; // Get the unique ID of the item the draggable was dropped over.

    // Check if the active draggable item has valid data.
    if (!hasDraggableData(active)) return;

    const activeData = active.data.current; // Get the current data associated with the active draggable item.

    // If the active item was dropped back onto itself, return early to avoid redundant operations.
    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column"; // Check if the active item is a column.
    if (!isActiveAColumn) return; // If the active item isn't a column, return early.

    // Reorder columns if the active item is a column and was dropped onto another column.
    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId); // Find the index of the active column.
      const overColumnIndex = columns.findIndex((col) => col.id === overId); // Find the index of the "over" column.
      return arrayMove(columns, activeColumnIndex, overColumnIndex); // Use arrayMove to reorder the columns.
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event; // Destructure active and over from the event.
    if (!over) return; // If there's no "over" item, return early.

    const activeId = active.id; // Get the unique ID of the active draggable item.
    const overId = over.id; // Get the unique ID of the item the draggable is over.

    // If the draggable item was dragged over itself, return early.
    if (activeId === overId) return;

    // Check if both the active and over items have valid draggable data.
    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current; // Get the current data for the active item.
    const overData = over.data.current; // Get the current data for the over item.

    const isActiveATask = activeData?.type === "Task"; // Check if the active item is a task.
    const isOverATask = overData?.type === "Task"; // Check if the over item is also a task.

    if (!isActiveATask) return; // If the active item isn't a task, return early.

    // Handle when dragging a task over another task.
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId); // Find the index of the active task.
        const overIndex = tasks.findIndex((t) => t.id === overId); // Find the index of the over task.
        const activeTask = tasks[activeIndex]; // Get the active task.
        const overTask = tasks[overIndex]; // Get the over task.

        // If the active task and over task belong to different columns, update the columnId of the active task.
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId; // Move the active task to the new column.
          return arrayMove(tasks, activeIndex, overIndex - 1); // Reorder tasks in the new column.
        }

        // If the active task is in the same column, just reorder the tasks within the column.
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column"; // Check if the over item is a column.

    // Handle when dragging a task over a column (but not over another task).
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId); // Find the index of the active task.
        const activeTask = tasks[activeIndex]; // Get the active task.
        if (activeTask) {
          activeTask.columnId = overId as ColumnId; // Update the columnId of the task if it was dropped over a column.
          return arrayMove(tasks, activeIndex, activeIndex); // Reorder tasks within the same column.
        }
        return tasks; // Return the original tasks array if no changes were made.
      });
    }
  }
}
