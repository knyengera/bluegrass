
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderTable from "@/components/orders/OrderTable";
import OrderDetailsDialog from "@/components/orders/OrderDetailsDialog";
import { Order } from "../services/api";

const Orders = () => {
  const { token } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['orders'],
    queryFn: () => token ? getOrders(token) : Promise.resolve([]),
    enabled: !!token,
  });

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load orders</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and view order details
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm py-1 px-2">
            Total: {orders?.length || 0}
          </Badge>
        </div>
      </div>

      {orders && orders.length > 0 ? (
        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-2 text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">
              When customers place orders, they will appear here.
            </p>
          </CardContent>
        </Card>
      )}
      
      {selectedOrder && (
        <OrderDetailsDialog 
          order={selectedOrder} 
          open={!!selectedOrder} 
          onClose={handleCloseDetails} 
        />
      )}
    </div>
  );
};

export default Orders;
