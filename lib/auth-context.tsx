import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PHONE_USER_KEY = "phone_login_user";

export interface User {
  id: number;
  phoneNumber: string | null;
  name: string | null;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化时从本地存储加载用户信息
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(PHONE_USER_KEY);
      if (userJson) {
        const userData = JSON.parse(userJson);
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(PHONE_USER_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Failed to save user:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(PHONE_USER_KEY);
      setUser(null);
    } catch (error) {
      console.error("Failed to remove user:", error);
      throw error;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      const updatedUser = { ...user, ...updates };
      await AsyncStorage.setItem(PHONE_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 使用用户认证Context的Hook
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
