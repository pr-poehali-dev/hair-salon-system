
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VisitorDataPoint } from "../dashboardData";

interface VisitorsChartProps {
  data: VisitorDataPoint[];
}

const VisitorsChart = ({ data }: VisitorsChartProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Клиенты</CardTitle>
        <CardDescription>Посещения за неделю</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              name="Посетители" 
              stroke="#8884d8" 
              strokeWidth={2} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default VisitorsChart;
