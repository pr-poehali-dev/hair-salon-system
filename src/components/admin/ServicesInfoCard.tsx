
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors } from "lucide-react";

interface ServicesInfoCardProps {
  totalServices: number;
  averageServicePrice: number;
}

const ServicesInfoCard = ({ totalServices, averageServicePrice }: ServicesInfoCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Услуги</CardTitle>
        <CardDescription>Сводная информация об услугах</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">Всего услуг</dt>
            <dd className="text-2xl font-bold">{totalServices}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Средняя цена</dt>
            <dd className="text-2xl font-bold">{averageServicePrice} ₽</dd>
          </div>
          <div className="col-span-2">
            <div className="flex items-center gap-2 mt-2">
              <Scissors className="h-5 w-5 text-primary" />
              <span>Самая популярная услуга: <strong>Женская стрижка</strong></span>
            </div>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default ServicesInfoCard;
