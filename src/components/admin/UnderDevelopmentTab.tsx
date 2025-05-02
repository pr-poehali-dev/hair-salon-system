
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

interface UnderDevelopmentTabProps {
  title: string;
  description: string;
  message: string;
}

const UnderDevelopmentTab = ({ title, description, message }: UnderDevelopmentTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-6 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Функция в разработке</h3>
          <p className="text-gray-500">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnderDevelopmentTab;
