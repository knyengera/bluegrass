import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/ui/icon";
import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuth } from "@/store/authStore";
import Icon from "@/components/Icon";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const setUser = useAuth((state) => state.setUser);
  const setToken = useAuth((state) => state.setToken);
  const setRefreshToken = useAuth((state) => state.setRefreshToken);

  const isLoggedIn = useAuth((state) => !!state.token);

  const LoginMutation = useMutation( {
    mutationFn: () => login(email, password), 
    onSuccess: ( data ) => {
      if (data.user && data.token && data.refreshToken) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        router.push("/");
      }
    }, onError: (error) => {
      console.log("Login failed", error);
      // lets show a toast
    }});

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  if (isLoggedIn) {
    router.push("/");
  }

  if (LoginMutation.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white px-6 pt-10">
          <Stack.Screen options={{ 
          headerLeft: () => <Link href="/register" asChild><Pressable><Icon name="ArrowLeft" size={18} color="black" /></Pressable></Link>,
          headerRight: () => 
          <Link href="/" asChild><Pressable><Text>Explore our App</Text></Pressable></Link> }} />
      <VStack space="xl" className="w-full h-full">
      <VStack space="xs">
          <Text className="text-4xl text-marble-green italic font-bold font-heading">Welcome back to</Text>
          <Text className="text-5xl text-marble-green italic font-bold font-heading">Pantry by Marble</Text>
          <Text className="text-lg text-marble-green mt-1">
            Login to your account to continue
          </Text>
        </VStack>
        <VStack space="md">
          <VStack space="xs">
            <Text className="text-sm text-typography-400">Email</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type="text"
                value={email}
                onChangeText={setEmail}
                className="text-base font-heading text-marble-green"
              />
              {email.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setEmail("")}>
                  <InputIcon as={CloseIcon} className="text-marble-green font-heading" />
                </InputSlot>
              )}
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-typography-400">Password</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                onChangeText={setPassword}
                className="text-base font-heading text-marble-green"
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  className="text-marble-green font-heading"
                />
              </InputSlot>
            </Input>
          </VStack>
        </VStack>

        <VStack space="md" className="mt-6">
          <View className="bg-marble-green rounded-full overflow-hidden">
            <Pressable
              onPress={() => LoginMutation.mutate()}
              className="py-4 px-6"
            >
              <Text className="text-white text-lg text-center">Login</Text>
            </Pressable>
          </View>

          <View className="flex-row justify-center items-center space-x-1">
            <Text className="text-typography-400">Don't have an account?</Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-marble-green">Sign up</Text>
              </Pressable>
            </Link>
          </View>

          <View className="border border-marble-green rounded-full overflow-hidden mt-4">
            <Pressable
              onPress={() => {
                // Navigate to index screen
                router.push("/");
              }}
              className="py-4 px-6"
            >
              <Text className="text-marble-green text-lg text-center">Explore our app</Text>
            </Pressable>
          </View>

          <View className="flex-row flex-wrap justify-center items-center px-4">
            <Text className="text-typography-400 text-xs">By logging in you agree to our </Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-marble-green text-xs">Terms</Text>
              </Pressable>
            </Link>
            <Text className="text-typography-400 text-xs">, </Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-marble-green text-xs">Data Policy</Text>
              </Pressable>
            </Link>
            <Text className="text-typography-400 text-xs">, and </Text>
            <Link href="/register" asChild>
              <Pressable>
                <Text className="text-marble-green text-xs">Cookies Policy</Text>
              </Pressable>
            </Link>
          </View>
        </VStack>
      </VStack>
    </View>
  );
}