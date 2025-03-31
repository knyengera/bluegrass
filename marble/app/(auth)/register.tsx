import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { EyeIcon, EyeOffIcon, CloseIcon } from "@/components/ui/icon";
import React from "react";
import { View, Pressable, ActivityIndicator, Alert } from "react-native";
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
  const [errors, setErrors] = React.useState({
    name: "",
    email: "",
    mobile: "",
    password: ""
  });
  const router = useRouter();

  const setUser = useAuth((state) => state.setUser);
  const setToken = useAuth((state) => state.setToken);
  const setRefreshToken = useAuth((state) => state.setRefreshToken);

  const isLoggedIn = useAuth((state) => !!state.token);

  const handleState = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      mobile: "",
      password: ""
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
      isValid = false;
    } else if (!/^\+?[1-9]\d{1,14}$/.test(mobile)) {
      newErrors.mobile = "Please enter a valid mobile number";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const RegisterMutation = useMutation({
    mutationFn: () => register(email, password, name, mobile),
    onSuccess: (data) => {
      if (data.user && data.token && data.refreshToken) {
        setUser(data.user);
        setToken(data.token);
        setRefreshToken(data.refreshToken);
        Alert.alert(
          "Registration Successful",
          "Welcome to Pantry by Marble! Your account has been created successfully.",
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
        "Registration Failed",
        "There was an error creating your account. Please try again.",
        [
          { 
            text: "OK",
            style: "default"
          }
        ],
        { cancelable: true }
      );
    },
  });

  const handleRegister = () => {
    if (validateForm()) {
      RegisterMutation.mutate();
    }
  };

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
          <Text className="text-5xl text-marble-green font-heading font-bold">Welcome to</Text>
          <Text className="text-5xl text-marble-green font-heading font-bold">Pantry by Marble</Text>
          <Text className="text-lg text-marble-green mt-1">
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
                onChangeText={(text) => {
                  setName(text);
                  setErrors(prev => ({ ...prev, name: "" }));
                }}
                className="text-lg font-heading text-marble-green"
              />
              {name.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setName("")}>
                  <InputIcon as={CloseIcon} className="text-marble-green font-heading" />
                </InputSlot>
              )}
            </Input>
            {errors.name ? <Text className="text-red-500 text-sm">{errors.name}</Text> : null}
          </VStack>

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
            <Text className="text-sm text-typography-400">Mobile number</Text>
            <Input className="border-0 border-b border-typography-200 rounded-none pb-2">
              <InputField
                type="text"
                value={mobile}
                onChangeText={(text) => {
                  setMobile(text);
                  setErrors(prev => ({ ...prev, mobile: "" }));
                }}
                className="text-lg font-heading text-marble-green"
                placeholder="+27"
                keyboardType="phone-pad"
              />
              {mobile.length > 0 && (
                <InputSlot className="pr-3" onPress={() => setMobile("")}>
                  <InputIcon as={CloseIcon} className="text-marble-green font-heading" />
                </InputSlot>
              )}
            </Input>
            {errors.mobile ? <Text className="text-red-500 text-sm">{errors.mobile}</Text> : null}
          </VStack>

          <VStack space="xs">
            <Text className="text-sm text-typography-400">Create password</Text>
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
              onPress={handleRegister}
              disabled={RegisterMutation.isPending}
              className="py-4 px-6"
            >
              <Text className="text-white text-lg text-center">Sign up</Text>
            </Pressable>
          </View>

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
