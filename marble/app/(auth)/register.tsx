import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/ui/icon";
import React from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/api/auth";
import { useAuth } from "@/store/authStore";
import { Box } from "@/components/ui/box";
import Icon from "@/components/Icon";
export default function RegisterScreen() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const router = useRouter();

  const setUser = useAuth((state) => state.setUser);
  const setToken = useAuth((state) => state.setToken);
  const setRefreshToken = useAuth((state) => state.setRefreshToken);

  const isLoggedIn = useAuth((state) => !!state.token);

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const RegisterMutation = useMutation({
    mutationFn: () => register(email, password, name, mobile),
    onSuccess: (data) => {
      if (data.user && data.token && data.refreshToken) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        router.push("/");
      }
    },
    onError: (error) => {
      console.log("Register failed", error);
      // lets show a toast
    },
  });

  if (RegisterMutation.isPending) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isLoggedIn) {
    router.push("/");
  }

  return (
    <View className="flex-1 bg-white px-6 pt-10">
        <Stack.Screen options={{ 
          headerLeft: () => <Link href="/login" asChild><Pressable><Icon name="ArrowLeft" size={18} color="black" /></Pressable></Link>,
          headerRight: () => 
          <Link href="/" asChild><Pressable><Text>Explore our App</Text></Pressable></Link> }} />
      <VStack space="xl" className="w-full">
        <VStack space="xs">
          <Text className="text-5xl text-marble-green italic font-bold">Welcome to</Text>
          <Text className="text-5xl text-marble-green italic font-bold">Pantry by Marble</Text>
          <Text className="text-2xl text-typography-400 mt-1">
            Sign up for easy payments, collection and much more
          </Text>
        </VStack>

        <Box className="w-full h-3 bg-marble-green" />

        <VStack space="md" className="mt-6">
          <VStack space="xs">
            <Text className="text-sm text-typography-400">Full name</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type="text"
                value={name}
                onChangeText={setName}
                className="text-base"
              />
              {name.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setName("")}>
                  <InputIcon as={CloseIcon} className="text-typography-400" />
                </InputSlot>
              )}
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-typography-400">Email</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type="text"
                value={email}
                onChangeText={setEmail}
                className="text-base"
              />
              {email.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setEmail("")}>
                  <InputIcon as={CloseIcon} className="text-typography-400" />
                </InputSlot>
              )}
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-typography-400">Mobile number</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type="text"
                value={mobile}
                onChangeText={setMobile}
                className="text-base"
                placeholder="+27"
              />
              {mobile.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setMobile("")}>
                  <InputIcon as={CloseIcon} className="text-typography-400" />
                </InputSlot>
              )}
            </Input>
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-typography-400">Create password</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                onChangeText={setPassword}
                className="text-base"
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  className="text-typography-400"
                />
              </InputSlot>
            </Input>
          </VStack>
        </VStack>

        <VStack space="md" className="mt-6">
          <View className="bg-marble-green rounded-full overflow-hidden">
            <Pressable
              onPress={() => RegisterMutation.mutate()}
              disabled={RegisterMutation.isPending}
              className="py-4 px-6"
            >
              <Text className="text-white text-lg text-center">Sign up</Text>
            </Pressable>
          </View>

          {RegisterMutation.error && (
            <Text className="text-red-500 text-center">Error: {RegisterMutation.error.message}</Text>
          )}

          <View className="flex-row justify-center items-center space-x-1">
            <Text className="text-typography-400">Have an account?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text className="text-marble-green">Login</Text>
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
            <Text className="text-typography-400 text-xs">By signing up you agree to our </Text>
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
