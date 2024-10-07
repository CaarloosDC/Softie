import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
interface BlueButtonProps {
  text: string;
  icon: ReactNode;
  children?: ReactNode; // * Optional to pass children. Alert will only trigger when children are passed
}

const BlueButton: React.FC<BlueButtonProps> = ({ text, icon, children }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="default"
          className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center"
        >
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </Button>
      </AlertDialogTrigger>
      {/* Only render AlertDialogContent if children are passed */}
      {children && (
        <AlertDialogContent className="overflow-auto">
          {children} {/* Content to render */}
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default BlueButton;
