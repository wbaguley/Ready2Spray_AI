import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface RevenueByCustomerChartProps {
  startDate?: string;
  endDate?: string;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export function RevenueByCustomerChart({ startDate, endDate }: RevenueByCustomerChartProps) {
  const { data, isLoading } = trpc.analytics.revenueByCustomer.useQuery({
    startDate,
    endDate,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Customer</CardTitle>
          <CardDescription>Distribution of jobs across customers</CardDescription>
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
          <CardTitle>Jobs by Customer</CardTitle>
          <CardDescription>Distribution of jobs across customers</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.customerName || "Unknown",
    value: item.jobCount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jobs by Customer</CardTitle>
        <CardDescription>Distribution of jobs across customers</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
