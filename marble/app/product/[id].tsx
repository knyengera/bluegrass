import { Pressable, View } from "react-native";
import { Text } from "@/components/ui/text";
import products from "@/assets/products.json";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Heading } from "@/components/ui/heading";
import { Box } from "@/components/ui/box";
import Icon from "@/components/Icon";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const product = products.find((product) => product.id === Number(id));

  if (!product) {
    return <Text>Product not found</Text>;
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
        <Link href="/cart" asChild>
           <Pressable>
           <Icon name="ShoppingCart" size={18} />
           </Pressable>
        </Link>
      </Box>
    </Card>
    </Box>
  );
}
