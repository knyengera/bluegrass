import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  createProduct, 
  updateProduct, 
  Product, 
  Category,
  getCategories 
} from "@/services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    { message: "Price must be a positive number" }
  ),
  quantity: z.string().min(1, "Quantity is required").refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    { message: "Quantity must be a non-negative integer" }
  ),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().url("Image must be a valid URL").min(1, "Image URL is required"),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
  const { token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => (token ? getCategories(token) : Promise.resolve([])),
    enabled: !!token,
  });
  
  const defaultValues: ProductFormValues = product
    ? {
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        categoryId: product.categoryId.toString(),
        image: product.image,
      }
    : {
        name: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        image: "",
      };
  
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });
  
  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      if (!token) throw new Error("No authentication token");
      return createProduct(token, {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        categoryId: parseInt(data.categoryId),
        image: data.image,
      });
    },
    onSuccess: () => {
      toast.success("Product created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to create product");
      setIsSubmitting(false);
    },
  });
  
  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      if (!token || !product) throw new Error("No authentication token or product");
      return updateProduct(token, product.id, {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        quantity: parseInt(data.quantity),
        categoryId: parseInt(data.categoryId),
        image: data.image,
      });
    },
    onSuccess: () => {
      toast.success("Product updated successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to update product");
      setIsSubmitting(false);
    },
  });
  
  const onSubmit = (data: ProductFormValues) => {
    setIsSubmitting(true);
    if (product) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };
  
  // Helper function to get full category name
  const getFullCategoryName = (category: Category, depth = 0): string => {
    if (category.parentId === 0) return category.name;
    
    const parent = categories.find(c => c.id === category.parentId);
    if (!parent) return category.name;
    
    return `${getFullCategoryName(parent, depth + 1)} > ${category.name}`;
  };

  // Helper function to render category options recursively
  const renderCategoryOptions = (categories: Category[], depth = 0) => {
    return categories.map((category) => (
      <React.Fragment key={category.id}>
        <SelectItem 
          value={category.id.toString()}
          className="pl-4"
          style={{ paddingLeft: `${depth * 1.5}rem` }}
        >
          {getFullCategoryName(category)}
        </SelectItem>
        {category.children && category.children.length > 0 && (
          renderCategoryOptions(category.children, depth + 1)
        )}
      </React.Fragment>
    ));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category">
                        {product ? categories.find(c => c.id === product.categoryId)?.name : "Select a category"}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {renderCategoryOptions(categories)}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Product description" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (R)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    step="0.01" 
                    min="0" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity in Stock</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min="0" 
                    step="1" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : product ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ProductForm;
