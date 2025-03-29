import { View, Text } from "react-native";
import { Product } from "../types/Product";

export default function ProductItem ({ product }: { product: Product }) {
    return <View> <Text>{product.name}</Text> </View>;
}

