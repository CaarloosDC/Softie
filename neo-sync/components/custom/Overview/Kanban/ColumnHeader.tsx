import { Plus, CheckCircle, Clock, ListChecks } from "lucide-react"; // Import additional icons
import { type Column } from "./BoardColumn";

export default function ColumnHeader({ column }: { column: Column }) {
  const style = "h-5";
  // Function to select the appropriate icon based on column ID
  const getIcon = (id: string) => {
    switch (id) {
      case "Pendientes":
        return <ListChecks className={style} />; // Icon for "todo" (e.g., list icon)
      case "En progreso":
        return <Clock className={style} />; // Icon for "in-progress" (e.g., clock icon)
      case "Aprobados":
        return <CheckCircle className={style} />; // Icon for "done" (e.g., check circle icon)
      default:
        return <Plus className="" />; // Default icon (fallback)
    }
  };

  return (
    <div className="flex flex-row justify-between bg-white dark:bg-primary-foreground p-2 shadow-sm rounded-md">
      <span className="font-bold">{column.title}</span>{" "}
      {/* Directly use column since it's a string */}
      {/* Conditionally render the icon based on column ID */}
      {getIcon(column.title)}
    </div>
  );
}
