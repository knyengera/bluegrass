
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/context/AuthContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Category, CategoryFormData, createCategory, getCategories, updateCategory } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  parentId: z.coerce.number(),
});

type CategoryFormProps = {
  category?: Category;
  onSuccess: () => void;
  onCancel: () => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSuccess, onCancel }) => {
  const { token } = useAuth();
  const isEditing = !!category;
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      parentId: category?.parentId || 0,
    },
  });
  
  // Fetch categories for parent selection
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => token ? getCategories(token) : Promise.resolve([]),
    enabled: !!token,
  });
  
  // Flatten categories for select options
  const flattenCategories = (cats: Category[], result: Category[] = []): Category[] => {
    cats.forEach(cat => {
      result.push(cat);
      if (cat.children && cat.children.length > 0) {
        flattenCategories(cat.children, result);
      }
    });
    return result;
  };
  
  const flatCategories = flattenCategories(categories);
  
  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data: CategoryFormData) => {
      if (!token) throw new Error("No authentication token");
      return isEditing && category
        ? updateCategory(token, category.id, data)
        : createCategory(token, data);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Category updated successfully" : "Category created successfully");
      onSuccess();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to save category");
    },
  });
  
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Ensure we pass a properly formatted CategoryFormData object
    const categoryData: CategoryFormData = {
      name: data.name,
      parentId: data.parentId,
    };
    
    mutation.mutate(categoryData);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Category name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Category</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parent category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">No Parent (Root Category)</SelectItem>
                  {flatCategories.map((cat) => (
                    // Don't allow setting a category as its own parent or child as parent
                    <SelectItem 
                      key={cat.id} 
                      value={cat.id.toString()}
                      disabled={isEditing && (cat.id === category?.id || (category?.children && category.children.some(child => child.id === cat.id)))}
                    >
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {isEditing ? (mutation.isPending ? "Updating..." : "Update Category") : 
                         (mutation.isPending ? "Creating..." : "Create Category")}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CategoryForm;
