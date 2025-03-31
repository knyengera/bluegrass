import { FlatList, View, ActivityIndicator } from "react-native";
import { useState } from "react";
import ProductItem from "../../components/ProductItem";
import CategoryFilter from "../../components/CategoryFilter";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { getProducts, getProductCategories } from "../../api/products";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";
import { useAuth } from "@/store/authStore";
import { router } from "expo-router";

type Product = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { data: products, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ["categories"],
    queryFn: getProductCategories,
  });

  const nuColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  }) as number;

  const filteredProducts = products?.filter((product: Product) => {
    if (selectedCategory === 'All') return true;
    
    // Find the selected category in the categories tree
    const findCategory = (cats: any[]): any => {
      for (const cat of cats) {
        if (cat.name === selectedCategory) return cat;
        if (cat.children) {
          const found = findCategory(cat.children);
          if (found) return found;
        }
      }
      return null;
    };

    const selectedCategoryData = findCategory(categories || []);
    if (!selectedCategoryData) return false;

    // Check if the product's categoryId matches the selected category or any of its children
    const isInCategory = (category: any): boolean => {
      if (product.categoryId === category.id) return true;
      if (category.children) {
        return category.children.some((child: any) => isInCategory(child));
      }
      return false;
    };

    return isInCategory(selectedCategoryData);
  });

  if (productsLoading || categoriesLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (productsError || categoriesError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error Fetching Data</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Product }) => (
    <View style={{ flex: 1, maxWidth: `${100 / nuColumns}%` }}>
      <ProductItem product={item} />
    </View>
  );

  return (
    <View className="flex-1 bg-white">
      <CategoryFilter
        categories={categories || []}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <View className="px-4 mb-2">
        <Text className="text-2xl font-heading text-marble-green">Based on your selection</Text>
        <Text className="text-5xl text-marble-green font-heading">Our products</Text>
      </View>
      
      <FlatList
        key={nuColumns}
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={nuColumns}
        contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
        columnWrapperClassName="gap-2"
      />
    </View>
  );
} 