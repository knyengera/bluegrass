import { toast } from "sonner";

const API_URL = "https://5e24499c-eea2-4e0a-b3c9-2b7698cc7cee.eu-central-1.cloud.genez.io";

interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isActive: boolean;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  country: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  categoryId: number;
  image: string;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
  updatedBy: number;
}

export interface Category {
  id: number;
  name: string;
  parentId: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: number;
  updatedBy?: number;
  children?: Category[];
}

export interface CategoryFormData {
  name: string;
  parentId: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
  createdBy: number;
}

export interface Order {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  paymentIntentId: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: number;
  createdBy: number;
  items: OrderItem[];
}

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Login failed');
    throw error;
  }
};

export const getAuthHeaders = (token: string) => ({
  'Authorization': `${token}`,
  'Content-Type': 'application/json',
});

export const getProducts = async (token: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch products');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch products');
    throw error;
  }
};

export const getCategories = async (token: string): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch categories');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch categories');
    throw error;
  }
};

export const getCategoryById = async (token: string, id: number): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/products/categories/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch category');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch category');
    throw error;
  }
};

export const createCategory = async (token: string, categoryData: CategoryFormData): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/products/categories`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create category');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create category');
    throw error;
  }
};

export const updateCategory = async (token: string, id: number, categoryData: Partial<CategoryFormData>): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/products/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update category');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to update category');
    throw error;
  }
};

export const deleteCategory = async (token: string, id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete category');
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to delete category');
    throw error;
  }
};

export const createProduct = async (token: string, productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create product');
    throw error;
  }
};

export const updateProduct = async (token: string, id: number, productData: Partial<Product>): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to update product');
    throw error;
  }
};

export const deleteProduct = async (token: string, id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to delete product');
    throw error;
  }
};

export const getOrders = async (token: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch orders');
    throw error;
  }
};

export const getOrderById = async (token: string, id: number): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch order');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch order');
    throw error;
  }
};

export const updateOrderStatus = async (token: string, id: number, status: string): Promise<Order> => {
  try {
    const response = await fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to update order status');
    throw error;
  }
};

export const getUsers = async (token: string): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch users');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch users');
    throw error;
  }
};

export const getUserById = async (token: string, id: number): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to fetch user');
    throw error;
  }
};

export const createUser = async (token: string, userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create user');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to create user');
    throw error;
  }
};

export const updateUser = async (token: string, id: number, userData: Partial<User>): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update user');
    }

    return await response.json();
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to update user');
    throw error;
  }
};

export const deleteUser = async (token: string, id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete user');
    }
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    throw error;
  }
};
