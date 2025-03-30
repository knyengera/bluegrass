import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack>
        <Stack.Screen name="index" options={{ title: "" }} />
        <Stack.Screen name="cart" options={{ title: "Cart" }} />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}