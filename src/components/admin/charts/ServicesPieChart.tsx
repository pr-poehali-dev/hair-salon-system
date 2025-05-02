
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { ServiceCategoryDataPoint } from "../dashboardData";

interface ServicesPieChartProps {
  data: ServiceCategoryDataPoint[];
  colors: string[];
}

const ServicesPieChart = ({ data, colors }: ServicesPieChartProps) => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Распределение услуг</CardTitle>
        <CardDescription>
          Популярность категорий услуг
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} записей`, undefined]} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ServicesPieChart;
