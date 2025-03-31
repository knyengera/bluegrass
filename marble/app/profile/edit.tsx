import { View, ScrollView, Pressable, TextInput } from "react-native";
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { useAuth } from "@/store/authStore";
import { Image } from "@/components/ui/image";
import { useRouter } from "expo-router";
import { useState } from "react";

type Panel = "personal" | "address";

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<Panel>("personal");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    username: user?.name?.toLowerCase().replace(" ", "_") || "",
    mobile: user?.mobile || "",
    email: user?.email || "",
    address1: user?.address1 || "",
    address2: user?.address2 || "",
    city: user?.city || "",
    province: user?.province || "",
    postalCode: user?.postalCode || "",
    country: user?.country || "",
  });

  const handleUpdate = () => {
    // TODO: Implement update logic
    router.back();
  };

  // Default placeholder image for all users
  const placeholderImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  const renderPersonalInfo = () => (
    <VStack space="lg">
      <Box>
        <Text className="text-gray-600 mb-1">Name</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter your name"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Username</Text>
        <TextInput
          value={formData.username}
          onChangeText={(text) => setFormData(prev => ({ ...prev, username: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter username"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Mobile number</Text>
        <TextInput
          value={formData.mobile}
          onChangeText={(text) => setFormData(prev => ({ ...prev, mobile: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter mobile number"
          keyboardType="phone-pad"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          value={formData.email}
          onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </Box>
    </VStack>
  );

  const renderAddress = () => (
    <VStack space="lg">
      <Box>
        <Text className="text-gray-600 mb-1">Address Line 1</Text>
        <TextInput
          value={formData.address1}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address1: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter address line 1"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Address Line 2</Text>
        <TextInput
          value={formData.address2}
          onChangeText={(text) => setFormData(prev => ({ ...prev, address2: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter address line 2"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">City</Text>
        <TextInput
          value={formData.city}
          onChangeText={(text) => setFormData(prev => ({ ...prev, city: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter city"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Province/State</Text>
        <TextInput
          value={formData.province}
          onChangeText={(text) => setFormData(prev => ({ ...prev, province: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter province or state"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Postal Code</Text>
        <TextInput
          value={formData.postalCode}
          onChangeText={(text) => setFormData(prev => ({ ...prev, postalCode: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter postal code"
        />
      </Box>

      <Box>
        <Text className="text-gray-600 mb-1">Country</Text>
        <TextInput
          value={formData.country}
          onChangeText={(text) => setFormData(prev => ({ ...prev, country: text }))}
          className="border-b border-gray-300 py-2 text-lg"
          placeholder="Enter country"
        />
      </Box>
    </VStack>
  );

  return (
    <View className="flex-1 bg-background">
      <ScrollView>
        <Box className="px-4 py-4">
          {/* Profile Image */}
          <View className="items-center mb-8">
            <Image
              size="2xl"
              source={{ uri: placeholderImage }}
              className="rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow">
              <Text>📷</Text>
            </View>
          </View>

          {/* Panel Selector */}
          <HStack className="mb-6 border-b border-gray-200">
            <Pressable
              onPress={() => setActivePanel("personal")}
              className={`flex-1 py-3 ${activePanel === "personal" ? "border-b-2 border-marble-green" : ""}`}
            >
              <Text className={`text-center ${activePanel === "personal" ? "text-marble-green font-semibold" : "text-gray-600"}`}>
                Personal Info
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setActivePanel("address")}
              className={`flex-1 py-3 ${activePanel === "address" ? "border-b-2 border-marble-green" : ""}`}
            >
              <Text className={`text-center ${activePanel === "address" ? "text-marble-green font-semibold" : "text-gray-600"}`}>
                Address
              </Text>
            </Pressable>
          </HStack>

          {/* Form Fields */}
          {activePanel === "personal" ? renderPersonalInfo() : renderAddress()}

          {/* Update Button */}
          <View className="mt-8 bg-marble-green rounded-full overflow-hidden">
            <Pressable
              onPress={handleUpdate}
              className="py-4 px-6"
            >
              <Text className="text-white text-lg text-center">Update Profile</Text>
            </Pressable>
          </View>
        </Box>
      </ScrollView>
    </View>
  );
} 