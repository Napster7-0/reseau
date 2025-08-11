import { getProducts, getWarehouses } from "@/lib/api";
import { StockView } from "@/components/stock/stock-view";

export default async function StockStatusPage() {
  const products = await getProducts();
  const warehouses = await getWarehouses();

  const productFamilies = [...new Set(products.map(p => p.family).filter(Boolean))] as string[];

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-grow min-h-0">
        <StockView />
      </div>
    </div>
  );
}