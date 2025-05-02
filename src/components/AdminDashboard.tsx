
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatCardsRow from "./admin/StatCardsRow";
import OverviewTab from "./admin/OverviewTab";
import UnderDevelopmentTab from "./admin/UnderDevelopmentTab";
import { calculateStatistics } from "./admin/dashboardData";

const AdminDashboard = () => {
  // Получаем все статистические данные
  const { 
    totalProducts, 
    totalServices, 
    totalStaff, 
    inStockProducts, 
    averageServicePrice, 
    averageProductPrice 
  } = calculateStatistics();
  
  return (
    <div className="space-y-6">
      {/* Верхний ряд информационных карточек */}
      <StatCardsRow 
        totalStaff={totalStaff} 
        inStockProducts={inStockProducts} 
      />
      
      {/* Вкладки с содержимым */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
          <TabsTrigger value="reports">Отчеты</TabsTrigger>
        </TabsList>
        
        {/* Вкладка обзора */}
        <TabsContent value="overview" className="space-y-4">
          <OverviewTab 
            totalServices={totalServices}
            totalProducts={totalProducts}
            inStockProducts={inStockProducts}
            averageServicePrice={averageServicePrice}
            averageProductPrice={averageProductPrice}
          />
        </TabsContent>
        
        {/* Вкладка аналитики */}
        <TabsContent value="analytics" className="py-4">
          <UnderDevelopmentTab 
            title="Расширенная аналитика"
            description="Эта функция находится в разработке"
            message="Скоро здесь появится расширенная аналитика с детальными отчетами по всем направлениям бизнеса"
          />
        </TabsContent>
        
        {/* Вкладка отчетов */}
        <TabsContent value="reports" className="py-4">
          <UnderDevelopmentTab 
            title="Отчеты"
            description="Эта функция находится в разработке"
            message="Скоро здесь появится возможность формирования различных отчетов"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
