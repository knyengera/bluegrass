import { useState, useEffect } from "react";
import { Order, getProducts, updateOrderStatus, getUserById, User } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface Product {
  id: number;
  name: string;
}

interface OrderDetailsDialogProps {
  order: Order;
  open: boolean;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<Product[]>([]);
  const [newStatus, setNewStatus] = useState(order.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [creatorName, setCreatorName] = useState<string>("");

  useEffect(() => {
    const fetchProducts = async () => {
      if (token) {
        try {
          const productsData = await getProducts(token);
          setProducts(productsData);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      }
    };

    const fetchUserName = async () => {
      if (token) {
        try {
          const userData = await getUserById(token, order.userId);
          setUserName(userData.name);
        } catch (error) {
          console.error("Error fetching user:", error);
          setUserName(`User #${order.userId}`);
        }
      }
    };

    const fetchCreatorName = async () => {
      if (token) {
        try {
          const creatorData = await getUserById(token, order.createdBy);
          setCreatorName(creatorData.name);
        } catch (error) {
          console.error("Error fetching creator:", error);
          setCreatorName(`User #${order.createdBy}`);
        }
      }
    };

    fetchProducts();
    fetchUserName();
    fetchCreatorName();
  }, [token, order.userId, order.createdBy]);

  useEffect(() => {
    // Reset status when opening with a new order
    setNewStatus(order.status);
  }, [order.id, order.status]);

  const getProductName = (productId: number) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      currencyDisplay: 'symbol',
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'shipped':
        return <Badge className="bg-blue-500">Shipped</Badge>;
      case 'processing':
        return <Badge className="bg-amber-500">Processing</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusChange = (value: string) => {
    setNewStatus(value);
  };

  const handleUpdateStatus = async () => {
    if (!token || newStatus === order.status) return;
    
    setIsUpdating(true);
    try {
      await updateOrderStatus(token, order.id, newStatus);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(`Order #${order.id} status updated to ${newStatus}`);
      setShowConfirmDialog(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusUpdateClick = () => {
    if (newStatus !== order.status) {
      setShowConfirmDialog(true);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-start gap-2">
              <span>Order #{order.id}</span>
              {getStatusBadge(order.status)}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="text-lg font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Ordered by</div>
                  <div className="text-md font-medium">{userName}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Items</div>
                  <div className="text-lg font-medium">{order.items.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Total</div>
                  <div className="text-lg font-medium">{formatCurrency(order.totalPrice)}</div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Order Status</h3>
                <div className="flex gap-2 items-center">
                  <Select value={newStatus} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant={newStatus !== order.status ? "default" : "outline"}
                    disabled={newStatus === order.status || isUpdating}
                    onClick={handleStatusUpdateClick}
                  >
                    Update Status
                  </Button>
                </div>
              </div>
              
              <Separator />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Order Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">#{item.id}</TableCell>
                        <TableCell>{getProductName(item.productId)}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex items-center justify-end pt-4">
              <div className="text-xl font-bold">
                Total: {formatCurrency(order.totalPrice)}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update this order's status from "{order.status}" to "{newStatus}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderDetailsDialog;
