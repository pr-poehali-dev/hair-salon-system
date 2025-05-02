
import { Calendar, CreditCard, DollarSign, Users } from "lucide-react";
import StatCard from "./StatCard";
import { totalAppointments, pendingAppointments } from "./dashboardData";

interface StatCardsRowProps {
  totalStaff: number;
  inStockProducts: number;
}

const StatCardsRow = ({ totalStaff, inStockProducts }: StatCardsRowProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Общая выручка"
        value="₽158,400"
        icon={DollarSign}
        description="+16.5% по сравнению с прошлым месяцем"
      />
      <StatCard
        title="Записи клиентов"
        value={totalAppointments}
        icon={Calendar}
        description={`${pendingAppointments} ожидают подтверждения`}
      />
      <StatCard
        title="Продажи"
        value={`+${inStockProducts}`}
        icon={CreditCard}
        description="Товаров в наличии"
      />
      <StatCard
        title="Мастера"
        value={totalStaff}
        icon={Users}
        description="Средняя загрузка: 80%"
      />
    </div>
  );
};

export default StatCardsRow;
