
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";
import { ArrowDown, ArrowUp, Clock, Package, ShoppingBag, Users } from "lucide-react";
import { getOrders, getProducts, getUsers } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";

// Add proper TypeScript interfaces for our data
interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend: string;
  color: string;
  trendUp?: boolean;
  alert?: boolean;
}

// Simple stat card component
const StatCard = ({ title, value, icon: Icon, trend, color, trendUp = true, alert = false }: StatCardProps) => (
  <Card className={`overflow-hidden ${alert ? "border-orange-500" : ""}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className={`rounded-full p-2 ${color}`}>
        <Icon size={16} className="text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground flex items-center mt-1">
        {trendUp ? (
          <ArrowUp size={12} className="mr-1 text-green-500" />
        ) : (
          <ArrowDown size={12} className="mr-1 text-red-500" />
        )}
        <span className={trendUp ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
          {trend}
        </span>{" "}
        from last month
      </p>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    projectedRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    activeUsers: 0,
    lowStockProducts: 0,
  });

  // Format currency to use R instead of $
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  // Fetch orders data
  const { data: orders = [] } = useQuery({
    queryKey: ["orders"],
    queryFn: () => token ? getOrders(token) : Promise.resolve([]),
    enabled: !!token,
  });

  // Fetch products data
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(token),
    enabled: !!token,
  });

  // Fetch users data
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => token ? getUsers(token) : Promise.resolve([]),
    enabled: !!token,
  });

  useEffect(() => {
    if (orders.length > 0) {
      // Count pending orders
      const pendingOrdersList = orders.filter(order => 
        order.status.toLowerCase() === "pending");
      
      // Calculate projected revenue (sum of all pending orders)
      const projectedRevenue = pendingOrdersList.reduce((sum, order) => 
        sum + Number(order.totalPrice), 0);
      
      // Count completed orders
      const completedOrders = orders.filter(order => 
        order.status.toLowerCase() === "completed").length;
      
      // Count active users excluding admins
      const activeNonAdminUsers = users.filter(user => 
        user.isActive && user.role.toLowerCase() !== "admin").length;

      // Count products with low stock (below 100)
      const lowStock = products.filter(product => product.quantity < 100).length;
      
      setStats({
        projectedRevenue,
        pendingOrders: pendingOrdersList.length,
        completedOrders,
        activeUsers: activeNonAdminUsers,
        lowStockProducts: lowStock,
      });
    }
  }, [orders, products, users]);

  // Get recent orders (last 5)
  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Get popular products based on order items
  const getPopularProducts = () => {
    const productCounts: Record<string, number> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const productId = String(item.productId);
        if (!productCounts[productId]) {
          productCounts[productId] = 0;
        }
        productCounts[productId] += Number(item.quantity);
      });
    });

    const sortedProducts = Object.entries(productCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return sortedProducts.map(([productId, count]) => {
      const product = products.find(p => p.id === Number(productId));
      return {
        id: productId,
        name: product ? product.name : `Product #${productId}`,
        count,
        lowStock: product ? product.quantity < 100 : false,
      };
    });
  };

  const popularProducts = products.length > 0 ? getPopularProducts() : [];

  // Get low stock products
  const getLowStockProducts = () => {
    return products
      .filter(product => product.quantity < 100)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  };

  const lowStockProducts = products.length > 0 ? getLowStockProducts() : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || "Admin"}! Here's an overview of your pantry.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Projected Revenue"
          value={formatCurrency(stats.projectedRevenue)}
          icon={ShoppingBag}
          trend="12%"
          color="bg-primary"
          trendUp={true}
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={Clock}
          trend="8%"
          color="bg-amber-500"
          trendUp={false}
        />
        <StatCard
          title="Completed Orders"
          value={stats.completedOrders.toString()}
          icon={Package}
          trend="24%"
          color="bg-green-500"
          trendUp={true}
        />
        <StatCard
          title="Active Users (Non-Admin)"
          value={stats.activeUsers.toString()}
          icon={Users}
          trend="18%"
          color="bg-pink-500"
          trendUp={true}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your most recent pantry orders</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map(order => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-right">{formatCurrency(order.totalPrice)}</p>
                      <p className="text-sm text-muted-foreground text-right">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent orders to display</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
            <CardDescription>Products with quantities below 100</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Category: {product.categoryId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${product.quantity < 50 ? "text-red-500" : "text-orange-500"}`}>
                        {product.quantity} in stock
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(product.price)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No low stock products</p>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trending Products</CardTitle>
            <CardDescription>Most ordered products</CardDescription>
          </CardHeader>
          <CardContent>
            {popularProducts.length > 0 ? (
              <div className="space-y-4">
                {popularProducts.map(product => (
                  <div key={product.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900">
                        {product.count}
                      </Badge>
                      {product.lowStock && (
                        <p className="text-xs text-orange-500 mt-1">Low Stock</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No trending products to display</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
