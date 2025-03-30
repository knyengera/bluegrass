import { FlatList, View, ActivityIndicator } from "react-native";
import ProductItem from "../components/ProductItem";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";
import { getProducts, getProductCategories } from "../api/products";
import { useQuery } from "@tanstack/react-query";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  // const { data: productCategories, isLoading: productCategoriesLoading, error: productCategoriesError } = useQuery({
  //   queryKey: ["productCategories"],
  //   queryFn: getProductCategories,
  // });

  const nuColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  }) as number;

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Error Fetching Products</Text>
      </View>
    );
  }

  // if (productCategoriesLoading) {
  //   return <ActivityIndicator />;
  // }

  // if (productCategoriesError) {
  //   return <Text>Error Fectching Product Categories</Text>;
  // }

  return (
    <View className="flex-1">
      <FlatList
        key={nuColumns}
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={nuColumns}
        contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
        columnWrapperClassName="gap-2"
      />
    </View>
  );
}