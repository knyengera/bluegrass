import { FlatList, View } from "react-native";
import products from "../assets/products.json";
import ProductItem from "../components/ProductItem";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <View>
        <VStack className="mb-6">
        <Text size="sm">
          Based on your selection
        </Text>
        <Heading size="md" className="mb-4">
          Our Products
        </Heading>
      </VStack>
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerClassName="gap-2"
        columnWrapperClassName="gap-2"
      />
    </View>
  );
}