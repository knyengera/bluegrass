import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";

export default function RootLayout() {
  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen name="index" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="products" />
      </Stack>
    </GluestackUIProvider>
  );
}
