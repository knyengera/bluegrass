import { Product } from "../types/Product";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Link } from "expo-router";
import { Pressable, Alert } from "react-native";
import Icon from "@/components/Icon";
import { useCart } from "@/store/cartStore";

export default function ProductItem ({ product }: { product: Product }) {
    const { addProduct } = useCart();

    const handleAddToCart = () => {
        addProduct(product);
        Alert.alert(
            "Added to Cart",
            `${product.name} has been added to your cart`,
            [
                { 
                    text: "OK",
                    style: "default",
                }
            ],
            { cancelable: true }
        );
    };

    return (
    <Card className="rounded-lg flex-1 mx-auto w-full overflow-hidden">
    <Link href={`/product/${product.id}`} asChild>
    <Pressable>
      <Image
        source={{
          uri: product.image,
        }}
        className="h-[240px] w-full rounded-xl aspect-[4/3]"
        alt={`${product.name} image`}
        resizeMode="contain"
      />
      <Text className="text-sm font-normal mb-2 text-typography-700">
        {product.name}
      </Text>
      </Pressable>
      </Link>
      <Box className="flex-row justify-between">
        <Heading size="md" className="mb-4">
            R{product.price}
        </Heading>
        <Pressable 
          onPress={handleAddToCart}
          className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
        >
           <Icon name="ShoppingCart" size={16} color="#54634B" />
        </Pressable>
      </Box>
    </Card>
    );
}

