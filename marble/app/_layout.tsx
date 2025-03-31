import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import * as Font from 'expo-font';
import { useCallback } from "react";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { OfflineScreen } from '@/components/OfflineScreen';

const queryClient = new QueryClient();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'AGaramondPro-Bold': require('../assets/fonts/AGaramondPro-Bold.otf'),
    'AGaramondPro-BoldItalic': require('../assets/fonts/AGaramondPro-BoldItalic.otf'),
    'Geomanist-Book': require('../assets/fonts/Geomanist-Book.otf'),
    'Geomanist-Light': require('../assets/fonts/Geomanist-Light.otf'),
    'Avenir': require('../assets/fonts/Avenir-Roman.ttf'),
    'Avenir-Medium': require('../assets/fonts/Avenir-Medium.ttf'),
    'Avenir-Black': require('../assets/fonts/Avenir-Black.ttf'),
    'MyriadPro-Regular': require('../assets/fonts/MyriadPro-Regular.otf'),
    'Helvetica Now Display': require('../assets/fonts/Monotype  - Helvetica Now Display.otf'),
  });

  const isConnected = useNetworkStatus();
  const [key, setKey] = useState(0);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const handleRetry = () => {
    setKey(prev => prev + 1);
  };

  if (isConnected === false) {
    return (
      <GluestackUIProvider key={key}>
        <OfflineScreen onRetry={handleRetry} />
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider key={key}>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
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
      </QueryClientProvider>
    </GluestackUIProvider>
  );
}