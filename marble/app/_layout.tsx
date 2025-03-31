import { Link, Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Pressable, View, Text   } from "react-native";
import Icon from "@/components/Icon";
import { useCart } from "@/store/cartStore";
import { HStack } from "@/components/ui/hstack";
const queryClient = new QueryClient();

export default function RootLayout() {
  const cartItemsNumber = useCart().items.length;

  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack screenOptions={{ 
          headerRight: () => (
            <HStack className="flex-row items-center space-x-12">
              <Pressable>
                <HStack className="flex-row items-center space-x-2">
                  <Text className="text-sm">Filter</Text>
                  <Icon name="SlidersHorizontal" size={18} color="black" />
                </HStack>
              </Pressable>
              
              {cartItemsNumber > 0 && (
                <Link href="/cart" asChild className="ml-4">
                  <Pressable>
                    <HStack className="flex-row items-center space-x-2">
                      <Icon name="ShoppingCart" size={18} color="black" />
                      <Text className="text-center text-white text-xs bg-marble-green rounded-full w-4 h-4 flex items-center justify-center">{cartItemsNumber}</Text>
                    </HStack>
                  </Pressable>
                </Link>
              )}
            </HStack>
          ),
          headerLeft: () => (
            <Link href="login" asChild className="ml-4">
              <Pressable>
                <Icon name="User" size={18} color="black" />
              </Pressable>
            </Link>
          )
          
        }}>
          <Stack.Screen name="index" options={{ title: "" }} />
          <Stack.Screen name="cart" options={{ title: "Cart" }} />
          <Stack.Screen name="(auth)/login" options={{ title: "Login" }} />
          <Stack.Screen name="(auth)/register" options={{ title: "Register" }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}