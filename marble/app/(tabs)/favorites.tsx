import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, Alert } from "react-native";
import { useFavorite } from "@/store/favoritesStore";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import Icon from "@/components/Icon";
import { Box } from "@/components/ui/box";
import { useRouter } from "expo-router";
import ProductActionSheet from "@/components/ProductActionSheet";
import { Product } from "@/types/Product";

export default function FavoritesScreen() {
  const router = useRouter();
  const { items, removeItem, clearFavorites } = useFavorite();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleClearFavorites = () => {
    Alert.alert(
      "Clear All Favorites",
      "Are you sure you want to remove all items from your favorites?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            clearFavorites();
            Alert.alert(
              "Favorites Cleared",
              "All items have been removed from your favorites.",
              [
                { 
                  text: "OK",
                  style: "default"
                }
              ],
              { cancelable: true }
            );
          }
        }
      ],
      { cancelable: true }
    );
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsActionSheetVisible(true);
  };

  if (items.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center p-4">
        <Text className="text-2xl font-bold text-marble-green mb-4">Your favorites is empty</Text>
        <Text className="text-gray-600 text-center mb-8">No products added to favorites yet. Please add some products to your favorites.</Text>
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
          <Text className="text-5xl font-heading text-marble-green">Favorites</Text>
          <Box className="h-[20px] bg-marble-green w-full my-2" />
          {items.map((item) => (
            <Card key={item.id}>
              <View className="flex-row gap-4">
                <Image
                  source={{
                    uri: item.image,
                  }}
                  className="h-24 w-24"
                  alt={`${item.name} image`}
                  resizeMode="contain"
                />
                <View className="flex-1 justify-between">
                  <View>
                    <Text className="text-lg italic">{item.name}</Text>
                    <Text className="text-lg font-semibold">R{item.price}</Text>
                  </View>
                  
                  <Box className="flex-row items-center justify-between mt-2">
                    <Pressable 
                      onPress={() => removeItem(item)}
                      className="border border-marble-green px-4 py-2 rounded-lg"
                    >
                      <Text className="text-marble-green">Remove</Text>
                    </Pressable>

                    <Pressable 
                      onPress={() => handleViewDetails(item)}
                      className="border border-marble-green px-4 py-2 rounded-lg"
                    >
                      <Text className="text-marble-green">View Details</Text>
                    </Pressable>
                  </Box>
                </View>
              </View>
              <Box className="h-[2px] bg-marble-green w-full my-4" />
            </Card>
          ))}

          <Box className="bg-marble-green/10 w-full p-4 rounded-lg mt-4">
            <Pressable 
              className="bg-marble-green rounded-full py-4 mt-6 mb-6"
              onPress={handleClearFavorites}
            >
              <Text className="text-white text-center text-lg font-semibold">
                Clear All Favorites
              </Text>
            </Pressable>
          </Box>
        </View>
      </ScrollView>
      {selectedProduct && (
        <ProductActionSheet 
          product={selectedProduct}
          visible={isActionSheetVisible}
          onClose={() => {
            setIsActionSheetVisible(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </View>
  );
} 