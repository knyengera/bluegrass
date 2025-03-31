import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/ui/icon";
import React from "react";
import { View, Pressable, ActivityIndicator, Alert } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuth } from "@/store/authStore";
import Icon from "@/components/Icon";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState({
    email: "",
    password: ""
  });
  const router = useRouter();

  const setUser = useAuth((state) => state.setUser);
  const setToken = useAuth((state) => state.setToken);
  const setRefreshToken = useAuth((state) => state.setRefreshToken);

  const isLoggedIn = useAuth((state) => !!state.token);

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: ""
    };

    let isValid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const LoginMutation = useMutation({ 
    mutationFn: () => login(email, password), 
    onSuccess: (data) => {
      if (data.user && data.token && data.refreshToken) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        Alert.alert(
          "Login Successful",
          "Welcome back! You have successfully logged in.",
          [
            { 
              text: "OK",
              style: "default",
              onPress: () => router.push("/")
            }
          ],
          { cancelable: false }
        );
      }
    }, 
    onError: (error) => {
      Alert.alert(
        "Login Failed",
        "Invalid email or password. Please try again.",
        [
          { 
            text: "OK",
            style: "default"
          }
        ],
        { cancelable: true }
      );
    }
  });

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = () => {
    if (validateForm()) {
      LoginMutation.mutate();
    }
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
                onChangeText={(text) => {
                  setEmail(text);
                  setErrors(prev => ({ ...prev, email: "" }));
                }}
                className="text-lg font-heading text-marble-green"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setEmail("")}>
                  <InputIcon as={CloseIcon} className="text-marble-green font-heading" />
                </InputSlot>
              )}
            </Input>
            {errors.email ? <Text className="text-red-500 text-sm">{errors.email}</Text> : null}
          </VStack>

          <VStack space="xs">
            <Text className="text-md text-typography-400">Password</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type={showPassword ? "text" : "password"}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrors(prev => ({ ...prev, password: "" }));
                }}
                className="text-lg font-heading text-marble-green"
              />
              <InputSlot className="pr-3" onPress={handleState}>
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  className="text-marble-green font-heading"
                />
              </InputSlot>
            </Input>
            {errors.password ? <Text className="text-red-500 text-sm">{errors.password}</Text> : null}
          </VStack>
        </VStack>

        <VStack space="md" className="mt-6">
          <View className="bg-marble-green rounded-full overflow-hidden">
            <Pressable
              onPress={handleLogin}
              disabled={LoginMutation.isPending}
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