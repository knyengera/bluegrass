import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Pressable, Text } from "react-native";
import { ArrowLeft } from "lucide-react-native";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen 
            name="product/[id]" 
            options={{ 
              headerShown: true,
              presentation: 'modal'
            }} 
          />
          <Stack.Screen 
            name="profile/edit" 
            options={{ 
              headerShown: true,
              title: "Edit Profile",
              headerLeft: () => (
                <Pressable onPress={() => router.back()}>
                  <ArrowLeft size={24} color="black" />
                </Pressable>
              )
            }}   
          />
        </Stack>
      </GluestackUIProvider>
    </QueryClientProvider>
  );
}