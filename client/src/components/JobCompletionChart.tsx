import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface JobCompletionChartProps {
  startDate?: string;
  endDate?: string;
}

export function JobCompletionChart({ startDate, endDate }: JobCompletionChartProps) {
  const { data, isLoading } = trpc.analytics.jobCompletionByPersonnel.useQuery({
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Job Completion by Personnel</CardTitle>
          <CardDescription>Completion rates for each team member</CardDescription>
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
          <CardTitle>Job Completion by Personnel</CardTitle>
          <CardDescription>Completion rates for each team member</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.personnelName || "Unassigned",
    completed: item.completedJobs,
    total: item.totalJobs,
    rate: item.completionRate || 0,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Completion by Personnel</CardTitle>
        <CardDescription>Completion rates for each team member</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completed" fill="hsl(var(--chart-1))" name="Completed Jobs" />
            <Bar dataKey="total" fill="hsl(var(--chart-2))" name="Total Jobs" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
