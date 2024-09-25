import {
  closestCorners, // A collision detection algorithm that finds the closest corners of droppable containers.
  getFirstCollision, // Utility to get the first collision from a list of detected collisions.
  KeyboardCode, // Enum-like object for keyboard key codes (e.g., "ArrowUp", "ArrowDown").
  DroppableContainer, // Represents a droppable container in the drag-and-drop system.
  KeyboardCoordinateGetter, // Type definition for a function to compute the coordinates when using the keyboard to move items.
} from "@dnd-kit/core";

// Array of keyboard directions that will trigger movement (Down, Right, Up, Left).
const directions: string[] = [
  KeyboardCode.Down,
  KeyboardCode.Right,
  KeyboardCode.Up,
  KeyboardCode.Left,
];

// The coordinateGetter function computes new coordinates based on keyboard navigation.
export const coordinateGetter: KeyboardCoordinateGetter = (
  event, // The keyboard event (e.g., a key press).
  { context: { active, droppableRects, droppableContainers, collisionRect } } // Destructured context object containing the current active element, droppable containers, and the current collision rectangle.
) => {
  // If the key pressed is one of the direction keys (Up, Down, Left, Right).
  if (directions.includes(event.code)) {
    event.preventDefault(); // Prevent default browser behavior for the direction key.

    // If there is no active draggable item or no collision rectangle, return early.
    if (!active || !collisionRect) {
      return;
    }

    // Array to store containers that can be considered for the next drop location.
    const filteredContainers: DroppableContainer[] = [];

    // Iterate over all enabled droppable containers to find valid targets.
    droppableContainers.getEnabled().forEach((entry) => {
      if (!entry || entry?.disabled) {
        return; // Skip disabled containers.
      }

      const rect = droppableRects.get(entry.id); // Get the bounding rectangle of the current droppable container.

      if (!rect) {
        return; // Skip if the droppable container does not have a valid rectangle.
      }

      const data = entry.data.current; // Get the current data associated with this droppable container.

      // Skip columns when the active item is not a column.
      if (data) {
        const { type, children } = data;
        if (type === "Column" && children?.length > 0) {
          if (active.data.current?.type !== "Column") {
            return;
          }
        }
      }

      // Determine the direction of movement and filter containers accordingly.
      switch (event.code) {
        case KeyboardCode.Down: // Moving downwards.
          if (active.data.current?.type === "Column") {
            return; // Do nothing if the active item is a column.
          }
          if (collisionRect.top < rect.top) {
            // If the collision rectangle is above the current droppable container, add it to the filtered list.
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Up: // Moving upwards.
          if (active.data.current?.type === "Column") {
            return; // Do nothing if the active item is a column.
          }
          if (collisionRect.top > rect.top) {
            // If the collision rectangle is below the current droppable container, add it to the filtered list.
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Left: // Moving left.
          if (collisionRect.left >= rect.left + rect.width) {
            // If the collision rectangle is to the right of the current container, add it to the filtered list.
            filteredContainers.push(entry);
          }
          break;
        case KeyboardCode.Right: // Moving right.
          if (collisionRect.left + collisionRect.width <= rect.left) {
            // If the collision rectangle is to the left of the current container, add it to the filtered list.
            filteredContainers.push(entry);
          }
          break;
      }
    });

    // Use the closestCorners collision detection algorithm to find the closest droppable container.
    const collisions = closestCorners({
      active, // The active draggable item.
      collisionRect: collisionRect, // The current position of the collision rectangle.
      droppableRects, // The list of all droppable container rectangles.
      droppableContainers: filteredContainers, // Only consider filtered containers.
      pointerCoordinates: null, // No pointer coordinates since this is keyboard-driven, not mouse-driven.
    });

    // Get the ID of the closest droppable container from the collision results.
    const closestId = getFirstCollision(collisions, "id");

    // If there is a valid closest container, compute the new coordinates.
    if (closestId != null) {
      const newDroppable = droppableContainers.get(closestId); // Get the closest droppable container.
      const newNode = newDroppable?.node.current; // Get the DOM node of the closest container.
      const newRect = newDroppable?.rect.current; // Get the rectangle of the closest container.

      // If both the node and the rectangle exist, return the top-left coordinates of the new droppable container.
      if (newNode && newRect) {
        return {
          x: newRect.left,
          y: newRect.top,
        };
      }
    }
  }

  // Return undefined if no valid drop location is found.
  return undefined;
};
