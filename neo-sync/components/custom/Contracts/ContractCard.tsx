"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  FileText,
  Eye,
  Trash2,
  Calendar,
  Download,
} from "lucide-react";
import BlueButton from "../BlueButton";
import { useRouter } from "next/navigation";
import CustomSeparator from "../Overview/CustomSeparator";

interface ContractCardProps {
  title: string;
  contractId: string;
  previewUrl: string | null;
  createdAt: string;
}

export default function ContractCard({title, contractId, previewUrl, createdAt}: ContractCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  //* Handle the click when going to specific contracts page
  const router = useRouter();

  const handleEdit = () => {
    if (previewUrl) {
      router.push(`/contracts/${contractId}?url=${encodeURIComponent(previewUrl)}`); // Navigates to /contracts/1
    } else {
      router.push(`/contracts/${contractId}`); // Navigates to /contracts/1 without URL
    }
  };

  return (
    <Card className="w-[300px] bg-white shadow-lg">
      <CardHeader className="flex flex-row justify-between items-center px-4 py-3">
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button size={"sm"} variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleEdit} className="cursor-pointer">
              <Eye className="mr-2 h-4 w-4" />
              <span>View</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-100">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 py-3 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {[1, 2].map((index) => (
            <div
              key={index}
              className="bg-gray-100 h-32 rounded-md flex items-center justify-center"
            >
              <FileText className="text-gray-400 h-12 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
      <CustomSeparator />
      <CardFooter className="flex justify-between items-center px-4 py-3">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="mr-2 h-4 w-4" />
          <span>{createdAt}</span>
        </div>
        {/* <BlueButton text="Descargar" icon={<Download className="h-3 w-3" />} /> */}
      </CardFooter>
    </Card>
  );
}
