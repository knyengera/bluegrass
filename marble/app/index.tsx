import { FlatList, View } from "react-native";
import products from "../assets/products.json";
import ProductItem from "../components/ProductItem";
import { useBreakpointValue } from "@/components/ui/utils/use-break-point-value";

export default function HomeScreen() {

  const nuColumns = useBreakpointValue({
    default: 2,
    sm: 3,
    xl: 4,
  }) as number;

  return (
    <View>
      <FlatList
        key={nuColumns}
        data={products}
        renderItem={({ item }) => <ProductItem product={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={nuColumns}
        contentContainerClassName="gap-2 max-w-[960px] mx-auto w-full"
        columnWrapperClassName="gap-2"
      />
    </View>
  );
}