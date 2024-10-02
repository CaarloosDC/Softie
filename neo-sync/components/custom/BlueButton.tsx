import { Button } from "@/components/ui/button"; // Import the Button component
import { ReactNode } from "react";

interface BlueButtonProps {
  text: string;
  icon: ReactNode; // icon
}

const BlueButton: React.FC<BlueButtonProps> = ({ text, icon }) => {
  return (
    <Button
      variant="default"
      className="bg-gray-800 hover:bg-gray-700 text-white rounded-md px-4 py-2 text-sm font-medium flex items-center"
    >
      {icon && <span className="mr-2">{icon}</span>} {/* Render the icon */}
      {text} {/* Render the button text */}
    </Button>
  );
};

export default BlueButton;
