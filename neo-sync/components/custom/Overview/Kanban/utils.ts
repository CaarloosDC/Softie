import { Active, DataRef, Over } from "@dnd-kit/core"; // Import types from dnd-kit.
import { ColumnDragData } from "./BoardColumn"; // Import the data structure for dragging a column.
import { TaskDragData } from "./TaskCard"; // Import the data structure for dragging a task.

// Define a type that can be either ColumnDragData or TaskDragData.
type DraggableData = ColumnDragData | TaskDragData;

// Utility function to check if a given `entry` (either `Active` or `Over` from dnd-kit) contains draggable data.
export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined // `entry` can be null, undefined, or a valid `Active` or `Over` object.
): entry is T & {
  data: DataRef<DraggableData>; // If `entry` has valid draggable data, it will contain a DataRef of `DraggableData`.
} {
  // If the entry is null or undefined, return false.
  if (!entry) {
    return false;
  }

  const data = entry.data.current; // Access the current data for the given entry.

  // Check if the data's type is either "Column" or "Task".
  if (data?.type === "Column" || data?.type === "Task") {
    return true; // If it's one of the valid types, return true.
  }

  return false; // Otherwise, return false.
}
