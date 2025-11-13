import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface EquipmentUtilizationChartProps {
  startDate?: string;
  endDate?: string;
}

export function EquipmentUtilizationChart({ startDate, endDate }: EquipmentUtilizationChartProps) {
  const { data, isLoading } = trpc.analytics.equipmentUtilization.useQuery({
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Utilization</CardTitle>
          <CardDescription>Usage rates for each piece of equipment</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Equipment Utilization</CardTitle>
          <CardDescription>Usage rates for each piece of equipment</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.equipmentName || "Unknown",
    utilization: item.utilizationRate || 0,
    totalJobs: item.totalJobs,
    activeJobs: item.activeJobs,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Utilization</CardTitle>
        <CardDescription>Usage rates for each piece of equipment</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} />
            <Tooltip />
            <Legend />
            <Bar dataKey="utilization" fill="hsl(var(--chart-3))" name="Utilization %" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
