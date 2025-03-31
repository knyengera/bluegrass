import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCart } from "@/store/cartStore";
import { Pressable, Text } from "react-native";
import { HStack } from "@/components/ui/hstack";
import Icon from "@/components/Icon";
import { Link } from "expo-router";
import { useAuth } from "@/store/authStore";

export default function TabsLayout() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const cartItemsNumber = items.length;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          backgroundColor: '#4A5D4A',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        headerShown: true,
        headerRight: () => (
          <HStack className="flex-row items-center space-x-12 mr-4">
            <Pressable>
              <HStack className="flex-row items-center space-x-2">
                <Text className="text-sm">Filter</Text>
                <Icon name="SlidersHorizontal" size={18} color="black" />
              </HStack>
            </Pressable>
            
            {cartItemsNumber > 0 && (
              <Link href="/(tabs)/cart" asChild>
                <Pressable>
                  <HStack className="flex-row items-center space-x-2">
                    <Icon name="ShoppingCart" size={18} color="black" />
                    <Text className="text-center text-white text-xs bg-marble-green rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemsNumber}
                    </Text>
                  </HStack>
                </Pressable>
              </Link>
            )}
          </HStack>
        ),
        headerLeft: () => (
          user ? (
            <Pressable className="ml-4" onPress={logout}>
              <Icon name="LogOut" size={18} color="black" />
            </Pressable>
          ) : (
            <Link href="/(auth)/login" asChild>
              <Pressable className="ml-4">
                <Icon name="User" size={18} color="black" />
              </Pressable>
            </Link>
          )
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
} 