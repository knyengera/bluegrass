import { View, ScrollView, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/store/authStore";
import { Image } from "@/components/ui/image";
import { useRouter } from "expo-router";
import { Settings, User2, CreditCard, HelpCircle, Share2, Info } from "lucide-react-native";

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const menuItems = [
    { icon: Settings, label: "Orders" },
    { icon: User2, label: "Update Profile" },
    { icon: CreditCard, label: "Payment Information" },
    { icon: HelpCircle, label: "Support" },
    { icon: Share2, label: "share" },
    { icon: Info, label: "About us" },
  ];

  // Default placeholder image for all users
  const placeholderImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-2xl font-bold text-marble-green mb-4">You are not currently logged in!</Text>
        <Text className="text-gray-600 text-center mb-8">Please login or register to manage your profile and view your orders.</Text>
        <View className="flex-row w-full gap-4">
          <Pressable 
            className="flex-1 bg-marble-green rounded-full px-4 py-4"
            onPress={() => router.push("/login")}
          >
            <Text className="text-white text-lg font-semibold text-center">Login</Text>
          </Pressable>
          <Pressable 
            className="flex-1 border-2 border-marble-green rounded-full px-4 py-4"
            onPress={() => router.push("/register")}
          >
            <Text className="text-marble-green text-lg font-semibold text-center">Register</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        {/* Profile Section */}
        <Box className="items-center px-4 pb-6 pt-4">
          <Image
            size="2xl"
            source={{ uri: placeholderImage }}
            className="rounded-full"
          />
          <Text className="text-2xl font-bold mt-4 text-marble-green">{user?.name}</Text>
          <Text className="text-marble-green/70">@{user?.name?.toLowerCase().replace(" ", "_")}</Text>
          
          <View className="w-full mt-4 bg-marble-green rounded-full overflow-hidden">
            <Pressable
              onPress={() => router.push("/profile/edit")}
              className="py-4 px-6"
            >
              <Text className="text-white text-lg text-center">Edit Profile</Text>
            </Pressable>
          </View>
        </Box>

        {/* Menu Items */}
        <VStack className="px-4">
          {menuItems.map((item, index) => (
            <Pressable 
              key={item.label}
              onPress={() => {}}
              className="py-2"
            >
              <HStack space="md" className="items-center">
                <item.icon size={24} color="#16A34A" />
                <Text className="text-lg text-marble-green">{item.label}</Text>
              </HStack>
              {index < menuItems.length - 1 && (
                <Box className="h-[1px] bg-border mt-2" />
              )}
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </View>
  );
} 