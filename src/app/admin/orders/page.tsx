import { Package } from "lucide-react";
import { getOrders } from "@/lib/actions/orders";
import OrdersList from "@/components/OrdersList";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Package className="w-5 h-5 text-sky-400" />
          <p className="text-sky-400/80 text-sm font-medium">Fulfillment</p>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Orders</h1>
        <p className="text-white/35 text-sm mt-1.5">
          Track and manage customer orders. {orders.length > 0 && <span className="text-white/50">{orders.length} total</span>}
        </p>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
