import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
interface BlueButtonProps {
  text: string;
  icon: ReactNode; // icon
  children: ReactNode; // View to render alert
}

const BlueButton: React.FC<BlueButtonProps> = ({ text, icon, children }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center"
        >
          {icon && <span className="mr-2">{icon}</span>} {/* Render icon */}
          {text} {/* Render button text */}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="overflow-auto">
        {" "}
        {/* Ensure content is inside dialog */}
        {children} {/* Pass the form content here */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BlueButton;
