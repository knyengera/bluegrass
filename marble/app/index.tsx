import { FlatList } from "react-native";
import products from "../assets/products.json";
import ProductItem from "../components/ProductItem";


export default function HomeScreen() {
  return (
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
  );
}