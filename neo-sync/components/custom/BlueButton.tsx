"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ReactNode, useState } from "react";
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
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog
      open={open}
      onOpenChange={(newOpen) => {
        if (open && !newOpen) {
          setOpen(false);
        } else if (!open && newOpen) {
          setOpen(true);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button size={"sm"} variant="default">
          {icon && <span className="mr-2">{icon}</span>}
          {text}
        </Button>
      </AlertDialogTrigger>
      {/* Only render AlertDialogContent if children are passed */}
      {children && (
        <AlertDialogContent className="overflow-auto">
          {React.cloneElement(children as React.ReactElement, {
            onClose: () => setOpen(false),
          })}
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
};

export default BlueButton;
