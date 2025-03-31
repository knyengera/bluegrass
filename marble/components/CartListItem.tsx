import { View, Text, Pressable } from "react-native";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { Box } from "@/components/ui/box";
import { useCart } from "@/store/cartStore";
import { Product } from "@/types/Product";

interface CartItemProps {
  cartItem: {
    product: Product;
    quantity: number;
  };
}

export default function CartListItem({ cartItem }: CartItemProps) {
  const { removeProduct, increaseQuantity, decreaseQuantity } = useCart();
  const { product, quantity } = cartItem;

  return (
    <Card>
      <View className="flex-row gap-4">
        <Image
          source={{
            uri: product.image,
          }}
          className="h-24 w-24"
          alt={`${product.name} image`}
          resizeMode="contain"
        />
        <View className="flex-1 justify-between">
          <View>
            <Text className="text-lg italic">{product.name}</Text>
            <Text className="text-lg font-semibold">R{product.price}</Text>
          </View>

          <Pressable
            onPress={() => removeProduct(product)}
            className="border border-marble-green px-4 py-2 rounded-lg"
          >
            <Text className="text-marble-green">Remove</Text>
          </Pressable>

          <View className="flex-row items-center gap-4">
            <Pressable
              onPress={() => decreaseQuantity(product)}
              className="p-2 border border-marble-green rounded-full w-8 h-8 items-center justify-center"
            >
              <Icon name="Minus" size={16} color="#54634B" />
            </Pressable>

            <Text className="text-lg">{quantity}</Text>

            <Pressable
              onPress={() => increaseQuantity(product)}
              className="p-2 border border-marble-green rounded-full w-8 h-8 items-center justify-center"
            >
              <Icon name="Plus" size={16} color="#54634B" />
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  );
} 