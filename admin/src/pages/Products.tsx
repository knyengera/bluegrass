import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getProducts, getCategories, Product, Category, deleteProduct } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Trash, ArrowUp, ArrowDown } from "lucide-react";
import ProductForm from "@/components/products/ProductForm";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const Products = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Product>("id");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Fetch products
  const { data: products = [], isLoading: isLoadingProducts, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: () => token ? getProducts(token) : Promise.resolve([]),
    enabled: !!token,
  });
  
  // Fetch categories to map IDs to names
  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => token ? getCategories(token) : Promise.resolve([]),
    enabled: !!token,
  });
  
  // Create a lookup map for category names
  const categoryMap: Record<number, string> = {};
  categories.forEach(category => {
    categoryMap[category.id] = category.name;
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("No authentication token");
      return deleteProduct(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    },
  });
  
  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortField === "price" || sortField === "quantity" || sortField === "id") {
      return sortDirection === "asc" 
        ? a[sortField] - b[sortField]
        : b[sortField] - a[sortField];
    }
    
    // For string fields
    if (a[sortField] && b[sortField]) {
      return sortDirection === "asc"
        ? String(a[sortField]).localeCompare(String(b[sortField]))
        : String(b[sortField]).localeCompare(String(a[sortField]));
    }
    
    return 0;
  });
  
  // Handle column sort
  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  // Handle product deletion
  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(id);
    }
  };
  
  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(price);
  };
  
  // Get category name from ID
  const getCategoryName = (categoryId: number): string => {
    const findCategory = (cats: Category[]): string | undefined => {
      for (const cat of cats) {
        if (cat.id === categoryId) return cat.name;
        if (cat.children && cat.children.length > 0) {
          const foundInChildren = findCategory(cat.children);
          if (foundInChildren) return foundInChildren;
        }
      }
      return undefined;
    };
    
    return findCategory(categories) || `Category ${categoryId}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button 
          onClick={() => setIsAddProductOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Add Product
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product inventory</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingProducts || isLoadingCategories ? (
            <div className="text-center py-4">Loading products...</div>
          ) : productsError ? (
            <div className="text-center text-red-500 py-4">
              Error loading products. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] cursor-pointer" onClick={() => handleSort("id")}>
                      ID
                      {sortField === "id" && (
                        sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>
                      Name
                      {sortField === "name" && (
                        sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Description</TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
                      Price
                      {sortField === "price" && (
                        sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="cursor-pointer" onClick={() => handleSort("quantity")}>
                      Quantity
                      {sortField === "quantity" && (
                        sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                      )}
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {product.description.length > 50
                            ? `${product.description.substring(0, 50)}...`
                            : product.description}
                        </TableCell>
                        <TableCell>{formatPrice(product.price)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="hidden md:table-cell">{getCategoryName(product.categoryId)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setEditingProduct(product)}
                              title="Edit product"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-destructive hover:bg-destructive hover:text-white"
                              title="Delete product"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new product to your inventory.
          </DialogDescription>
          <ProductForm 
            onSuccess={() => {
              setIsAddProductOpen(false);
              queryClient.invalidateQueries({ queryKey: ["products"] });
            }}
            onCancel={() => setIsAddProductOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product details below.
          </DialogDescription>
          {editingProduct && (
            <ProductForm 
              product={editingProduct}
              onSuccess={() => {
                setEditingProduct(null);
                queryClient.invalidateQueries({ queryKey: ["products"] });
              }}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
