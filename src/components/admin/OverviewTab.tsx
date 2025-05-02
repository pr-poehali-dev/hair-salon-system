
import RevenueChart from "./charts/RevenueChart";
import ServicesPieChart from "./charts/ServicesPieChart";
import ServicesInfoCard from "./ServicesInfoCard";
import ProductsInfoCard from "./ProductsInfoCard";
import VisitorsChart from "./charts/VisitorsChart";
import { 
  revenueData, 
  serviceByCategory, 
  CHART_COLORS, 
  visitorsData
} from "./dashboardData";

interface OverviewTabProps {
  totalServices: number;
  totalProducts: number;
  inStockProducts: number;
  averageServicePrice: number;
  averageProductPrice: number;
}

const OverviewTab = ({
  totalServices,
  totalProducts,
  inStockProducts,
  averageServicePrice,
  averageProductPrice
}: OverviewTabProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <RevenueChart data={revenueData} />
        <ServicesPieChart data={serviceByCategory} colors={CHART_COLORS} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ServicesInfoCard 
          totalServices={totalServices}
          averageServicePrice={averageServicePrice}
        />
        <ProductsInfoCard 
          totalProducts={totalProducts}
          inStockProducts={inStockProducts}
          averageProductPrice={averageProductPrice}
        />
        <VisitorsChart data={visitorsData} />
      </div>
    </div>
  );
};

export default OverviewTab;
