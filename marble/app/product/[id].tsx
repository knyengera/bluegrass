import { Pressable, ActivityIndicator, View } from "react-native";
import { Text } from "@/components/ui/text";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import Icon from "@/components/Icon";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "@/api/products";
import { useCart } from "@/store/cartStore";
import { useFavorite } from "@/store/favoritesStore";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const addProduct = useCart((state) => state.addProduct);
  const { items, addItem, removeItem } = useFavorite();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
  });

  const isFavorite = items.some(item => item.id === product?.id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } 

  if (error) {
    return <Text>Error Fectching Product</Text>;
  }

  return (
    <Box className="flex-1 items-center p-3 bg-white">
    <Stack.Screen name="product/[id]" options={{ title: product.name }} />
    <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1">
      <Image
        source={{
          uri: product.image,
        }}
        className="mb-6 h-[240px] w-full rounded-md"
        resizeMode="contain"
        alt={`${product.name} image`}
      />
      <Heading size="md" className="mb-4 text-xl font-heading uppercase text-marble-green">
        {product.name}
      </Heading>
        <Text size="sm" className="mb-3 text-marble-green text-lg font-body">
          {product.description}
        </Text>
      <Box className="flex-row justify-between">
        <Heading size="xs" className="mb-4 text-xl font-bold text-marble-green">
            R{product.price}
        </Heading>
        <Box className="flex-row gap-2">
          <Pressable 
            onPress={() => addProduct(product)}
            className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
          >
            <Icon name="ShoppingCart" size={16} color="#54634B" />
          </Pressable>
          <Pressable 
            onPress={() => isFavorite ? removeItem(product) : addItem(product)}
            className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
          >
            <Icon name={isFavorite ? "Heart" : "HeartOff"} size={16} color="#54634B" />
          </Pressable>
        </Box>
      </Box>
    </Card>
    </Box>
  );
}
