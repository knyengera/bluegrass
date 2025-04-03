
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getCategories, Category, deleteCategory } from "@/services/api";
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
import { Search, Plus, Edit, Trash, ChevronRight, ChevronDown } from "lucide-react";
import CategoryForm from "@/components/categories/CategoryForm";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type ExpandedCategories = {
  [key: number]: boolean;
};

const Categories = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<ExpandedCategories>({});
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Fetch categories
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: () => token ? getCategories(token) : Promise.resolve([]),
    enabled: !!token,
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => {
      if (!token) throw new Error("No authentication token");
      return deleteCategory(token, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category deleted successfully");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Failed to delete category");
    },
  });
  
  // Find parent category name by parentId
  const findParentCategoryName = (parentId: number): string => {
    if (parentId === 0) return "None";
    
    const findCategory = (cats: Category[]): string => {
      for (const cat of cats) {
        if (cat.id === parentId) return cat.name;
        if (cat.children && cat.children.length > 0) {
          const foundInChildren = findCategory(cat.children);
          if (foundInChildren) return foundInChildren;
        }
      }
      return "Unknown";
    };
    
    return findCategory(categories);
  };
  
  // Toggle expanded state of a category
  const toggleExpand = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // Filter categories based on search term
  const filterCategories = (cats: Category[], term: string): Category[] => {
    return cats.map(cat => {
      // Deep clone the category to avoid modifying the original
      const newCat = { ...cat };
      
      // Filter children if they exist
      if (newCat.children && newCat.children.length > 0) {
        newCat.children = filterCategories(newCat.children, term);
      }
      
      // Include this category if its name matches the search term or if any children match
      return newCat.name.toLowerCase().includes(term.toLowerCase()) ||
        (newCat.children && newCat.children.length > 0)
        ? newCat
        : null;
    }).filter(Boolean) as Category[];
  };
  
  const filteredCategories = searchTerm 
    ? filterCategories(categories, searchTerm) 
    : categories;
  
  // Handle category deletion
  const handleDeleteCategory = (id: number) => {
    if (window.confirm("Are you sure you want to delete this category? This will also delete all subcategories.")) {
      deleteCategoryMutation.mutate(id);
    }
  };
  
  // Render category hierarchy recursively
  const renderCategoryRow = (category: Category, depth = 0) => {
    const isExpanded = expandedCategories[category.id] || false;
    const hasChildren = category.children && category.children.length > 0;
    const parentName = findParentCategoryName(category.parentId);
    
    return (
      <React.Fragment key={category.id}>
        <TableRow>
          <TableCell className="px-4 py-2">
            <div 
              className="flex items-center" 
              style={{ paddingLeft: `${depth * 1.5}rem` }}
            >
              {hasChildren ? (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 p-0 mr-1" 
                  onClick={() => toggleExpand(category.id)}
                >
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </Button>
              ) : (
                <div className="w-6 mr-1"></div>
              )}
              {category.name}
            </div>
          </TableCell>
          <TableCell>{parentName}</TableCell>
          <TableCell>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setEditingCategory(category)}
                title="Edit category"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDeleteCategory(category.id)}
                className="text-destructive hover:bg-destructive hover:text-white"
                title="Delete category"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
        
        {hasChildren && isExpanded && category.children?.map(child => 
          renderCategoryRow(child, depth + 1)
        )}
      </React.Fragment>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button 
          onClick={() => setIsAddCategoryOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus size={18} /> Add Category
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Organize your product categories</CardDescription>
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading categories...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              Error loading categories. Please try again.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Parent Category</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map(category => renderCategoryRow(category))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Add New Category</DialogTitle>
          <DialogDescription>
            Fill out the form below to add a new category.
          </DialogDescription>
          <CategoryForm 
            onSuccess={() => {
              setIsAddCategoryOpen(false);
              queryClient.invalidateQueries({ queryKey: ["categories"] });
            }}
            onCancel={() => setIsAddCategoryOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent className="max-w-lg">
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category details below.
          </DialogDescription>
          {editingCategory && (
            <CategoryForm 
              category={editingCategory}
              onSuccess={() => {
                setEditingCategory(null);
                queryClient.invalidateQueries({ queryKey: ["categories"] });
              }}
              onCancel={() => setEditingCategory(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
