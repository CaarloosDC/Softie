import { Card, CardContent } from "@/components/ui/card";

export interface ProjectInfo {
  id: string;
  nombre: string;
  descripcion: string;
}

interface InfoCardProps {
  projectInfo: ProjectInfo;
}

export default function InfoCard({ projectInfo }: InfoCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-2">
        <p className="text-sm leading-relaxed">{projectInfo.descripcion}</p>
      </CardContent>
    </Card>
  );
}
