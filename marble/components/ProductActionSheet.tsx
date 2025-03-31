import React from 'react';
import { Modal, View, Pressable, Dimensions } from 'react-native';
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Image } from "@/components/ui/image";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import Icon from "@/components/Icon";
import { useCart } from "@/store/cartStore";
import { useFavorite } from "@/store/favoritesStore";
import { Product } from "../types/Product";
import { Alert } from "react-native";

const { height } = Dimensions.get('window');

interface ProductActionSheetProps {
  product: Product;
  visible: boolean;
  onClose: () => void;
}

export default function ProductActionSheet({ product, visible, onClose }: ProductActionSheetProps) {
  const addProduct = useCart((state) => state.addProduct);
  const { items, addItem, removeItem } = useFavorite();

  const isFavorite = items.some(item => item.id === product?.id);

  const handleAddToCart = () => {
    addProduct(product);
    Alert.alert(
      "Added to Cart",
      `${product.name} has been added to your cart`,
      [{ text: "OK", style: "default" }],
      { cancelable: true }
    );
  };

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeItem(product);
      Alert.alert(
        "Removed from Favorites",
        `${product.name} has been removed from your favorites`,
        [{ text: "OK", style: "default" }],
        { cancelable: true }
      );
    } else {
      addItem(product);
      Alert.alert(
        "Added to Favorites",
        `${product.name} has been added to your favorites`,
        [{ text: "OK", style: "default" }],
        { cancelable: true }
      );
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/50" 
        onPress={onClose}
      >
        <View className="flex-1 justify-end">
          <Pressable 
            className="bg-white rounded-t-3xl p-4"
            style={{ maxHeight: height * 0.8 }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="items-center mb-4">
              <View className="w-12 h-1 bg-gray-300 rounded-full" />
            </View>
            
            <Card className="p-5 rounded-lg">
              <Image
                source={{
                  uri: product.image,
                }}
                className="mb-6 h-[240px] w-full rounded-md"
                resizeMode="contain"
                alt={`${product.name} image`}
              />
              <Heading size="md" className="mb-4 text-xl font-heading uppercase text-marble-green">
                {product.name}
              </Heading>
              <Text size="sm" className="mb-3 text-marble-green text-lg font-body">
                {product.description}
              </Text>
              <Box className="flex-row justify-between">
                <Heading size="xs" className="mb-4 text-xl font-bold text-marble-green">
                  R{product.price}
                </Heading>
                <Box className="flex-row gap-2">
                  <Pressable 
                    onPress={handleAddToCart}
                    className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Icon name="ShoppingCart" size={16} color="#54634B" />
                  </Pressable>
                  <Pressable 
                    onPress={handleToggleFavorite}
                    className="border border-marble-green rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Icon name={isFavorite ? "Heart" : "HeartOff"} size={16} color="#54634B" />
                  </Pressable>
                </Box>
              </Box>
            </Card>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
} 