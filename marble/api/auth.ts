import { User } from "@/store/authStore";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const register = async (email: string, password: string, name: string, mobile: string) => {
  try { 
    const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name, mobile }),
  });
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
  } catch (error) {
    console.error(error);
  }
};

