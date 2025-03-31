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

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const addProduct  = useCart((state) => state.addProduct);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id as string),
  });

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
    <Box className="flex-1 items-center p-3">
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
      <Heading size="md" className="mb-4">
        {product.name}
      </Heading>
        <Text size="sm" className="mb-3">
          {product.description}
        </Text>
      <Box className="flex-row justify-between">
        <Heading size="xs" className="mb-4">
            R{product.price}
        </Heading>
        <Pressable 
          onPress={() => addProduct(product)}
          className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
        >
           <Icon name="ShoppingCart" size={16} color="#54634B" />
        </Pressable>
      </Box>
    </Card>
    </Box>
  );
}
