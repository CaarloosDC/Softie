"use client"

import { useEffect, useState } from 'react';
import { createClient } from "@/utils/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { ChartContainer } from "@/components/ui/chart";
import { addDays, format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

interface Requirement {
  id: string;
  nombre: string;
  descripcion: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  esfuerzo_requerimiento?: number;
}

interface GanttData {
  name: string;
  start: number;
  duration: number;
  description: string;
  padding: number;
}

const chartConfig = {
  tasks: {
    label: "Tareas",
    color: "hsl(var(--chart-1))",
  }
};

export default function Cronogram({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<GanttData[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());

  useEffect(() => {
    const fetchRequirements = async () => {
      const supabase = createClient();
      
      const { data: requirements, error } = await supabase
        .from("requerimiento")
        .select("*")
        .eq("proyecto_id", projectId)
        .order('fecha_inicio', { ascending: true });

      if (error) {
        console.error("Error fetching requirements:", error);
        return;
      }

      if (requirements && requirements.length > 0) {
        // Find the earliest start date
        const earliestDate = new Date(Math.min(
          ...requirements.map(req => new Date(req.fecha_inicio || new Date()).getTime())
        ));
        setStartDate(earliestDate);

        // Transform requirements into Gantt data
        const ganttData = requirements.map((req: Requirement) => {
          const startDays = differenceInDays(
            new Date(req.fecha_inicio || new Date()),
            earliestDate
          );
          
          return {
            name: req.nombre,
            padding: startDays,
            duration: differenceInDays(
              new Date(req.fecha_fin || new Date()),
              new Date(req.fecha_inicio || new Date())
            ),
            description: req.descripcion,
            start: startDays
          };
        });

        setTasks(ganttData);
      }
    };

    fetchRequirements();
  }, [projectId]);

  const CustomBar = (props: any) => {
    const { x, y, width, height } = props;
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="hsl(var(--chart-1))"
          rx={4}
          ry={4}
        />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <div className="font-medium">{data.name}</div>
            <div className="text-right text-muted-foreground">
              {format(addDays(startDate, data.start), 'dd/MM/yyyy', { locale: es })}
              {' - '}
              {format(addDays(startDate, data.start + data.duration), 'dd/MM/yyyy', { locale: es })}
            </div>
            <div className="col-span-2 text-sm text-muted-foreground">
              {data.description}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart
            data={tasks}
            layout="vertical"
            barSize={20}
            margin={{ top: 20, right: 30, left: 150, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={(value) => 
                format(addDays(startDate, value), 'dd/MM', { locale: es })
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              width={140}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="padding"
              stackId="a"
              fill="transparent"
            />
            <Bar
              dataKey="duration"
              stackId="a"
              fill="hsl(var(--chart-1))"
              shape={<CustomBar />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}