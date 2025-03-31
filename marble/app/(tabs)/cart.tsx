import { View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useCart } from "@/store/cartStore";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { createOrder } from "@/api/products";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/store/authStore";

export default function CartScreen() {
  const router = useRouter();
  const { items, removeProduct, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const { user, token } = useAuth();

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const deliveryFee = subtotal * 0.10; // 10% of subtotal
  const total = subtotal + deliveryFee;

  const createOrderMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("No authentication token");
      return createOrder({
        order: {
          totalPrice: total,
          status: 'pending'
        },
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }, token);
    },
    onSuccess: () => {
      console.log("Order created successfully");
      clearCart();
      router.replace("/");
    }
  });

  const handleCheckout = () => {
    if (items.length > 0) {
      createOrderMutation.mutate();
    }
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-2xl font-bold text-marble-green mb-4">Your cart is empty</Text>
        <Text className="text-gray-600 text-center mb-8">No products added yet. Please add some products to your cart.</Text>
        <Pressable 
          className="bg-marble-green rounded-full px-8 py-4"
          onPress={() => router.push("/")}
        >
          <Text className="text-white text-lg font-semibold">Browse Products</Text>
        </Pressable>
      </View>
    );
  }
  
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          <Text className="text-5xl font-heading text-marble-green">Cart</Text>
          <Text className="text-3xl font-heading-normal text-marble-green mt-2">Your Shopping Cart</Text>
          <Box className="h-[20px] bg-marble-green w-full my-2" />
          {items.map((item) => (
            <Card key={item.product.id} >
              <View className="flex-row gap-4">
                <Image
                  source={{
                    uri: item.product.image,
                  }}
                  className="h-24 w-24 "
                  alt={`${item.product.name} image`}
                  resizeMode="contain"
                />
                <View className="flex-1 justify-between ">
                  <View>
                    <Text className="text-xl font-heading uppercase text-marble-green">{item.product.name}</Text>
                    <Text className="text-xl font-bold text-marble-green">R{item.product.price}</Text>
                  </View>
                  
                  <Box className="flex-row items-center justify-between mt-2">
                  <Pressable 
                      onPress={() => removeProduct(item.product)}
                      className="border border-marble-green px-4 py-2 rounded-lg"
                    >
                      <Text className="text-marble-green">Remove</Text>
                    </Pressable>

                    <View className="flex-row items-center gap-4">
                      <Pressable 
                        onPress={() => decreaseQuantity(item.product)}
                        className="p-2 border border-marble-green rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Icon name="Minus" size={16} color="#54634B" />
                      </Pressable>
                      
                      <Text className="text-lg">{item.quantity}</Text>
                      
                      <Pressable 
                        onPress={() => increaseQuantity(item.product)}
                        className="p-2 border border-marble-green rounded-full w-8 h-8 items-center justify-center"
                      >
                        <Icon name="Plus" size={16} color="#54634B" />
                      </Pressable>
                    </View>
                  </Box>
                </View>
              </View>
              <Box className="h-[2px] bg-marble-green w-full my-4" />
            </Card>
          ))}

          {/* Promo Code Input */}
          <View className="flex-row items-center border border-gray-200 rounded-full overflow-hidden my-4">
            <TextInput 
              placeholder="Add your promo code"
              className="flex-1 px-4 py-3"
            />
            <Box className="h-[60%] w-[2px] bg-marble-green self-center" />
            <Pressable className="px-6 py-3">
              <Text className="text-gray-400">Apply</Text>
            </Pressable>
          </View>

          <Box className="bg-marble-green/10 w-full p-4 rounded-lg">
            {/* Totals Section */}
            <View className="space-y-4 mb-4">
              <View className="flex-row justify-between mb-4">
                <Text className="text-marble-green">Sub total</Text>
                <Text className="font-semibold text-marble-green">R {subtotal.toFixed(2)}</Text>
              </View>
              
              <View className="flex-row justify-between mb-4">
                <Text className="text-marble-green">Delivery</Text>
                <Text className="font-semibold text-marble-green">R {deliveryFee.toFixed(2)}</Text>
              </View>

              <Box className="h-[2px] bg-marble-green w-full mb-4" />
              
              <View className="flex-row justify-between">
                <Text className="text-xl font-heading-normal font-bold text-marble-green">Total</Text>
                <Text className="text-xl font-heading-normal font-bold text-marble-green">R {total.toFixed(2)}</Text>
              </View>
            </View>

            {/* Checkout Button */}
            {!user ? (
              <View className="space-y-4">
                <Pressable 
                  className="bg-marble-green rounded-full py-4 mb-2"
                  onPress={() => router.push("/login")}
                >
                  <Text className="text-white text-center text-lg font-semibold">Log In</Text>
                </Pressable>
                <Text className="text-center text-marble-green">Please log in to checkout</Text>
              </View>
            ) : (
              <Pressable 
                className="bg-marble-green rounded-full py-4 mt-6 mb-6"
                onPress={handleCheckout}
                disabled={createOrderMutation.isPending}
              >
                <Text className="text-white text-center text-lg font-semibold">
                  {createOrderMutation.isPending ? "Processing..." : "Checkout"}
                </Text>
              </Pressable>
            )}
          </Box>
        </View>
      </ScrollView>
    </View>
  );
}
