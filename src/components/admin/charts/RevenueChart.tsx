
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { RevenueDataPoint } from "../dashboardData";

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Выручка</CardTitle>
        <CardDescription>
          Динамика выручки за последние 6 месяцев
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value} ₽`, undefined]}
              labelFormatter={(value) => `Месяц: ${value}`}
            />
            <Bar dataKey="services" fill="#8884d8" name="Услуги" />
            <Bar dataKey="products" fill="#82ca9d" name="Товары" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
