"use client"; // Ensure this is at the top of the file

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

// Interface for the user object
interface User {
  id: number;
  username: string;
  profileImage: string;
  nationality?: string; // Optional field
}

// Interface for login, signup, and other functions
interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (userData: FormData) => Promise<void>;
  logout: () => void;
  saveProfile: (updatedUserData: User) => Promise<void>;
  user: User | null; // Updated to reflect User type
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = localStorage.getItem("isAuthenticated") === "true";
      const userData = localStorage.getItem("user");

      setIsAuthenticated(authStatus);
      setUser(
        userData && userData !== "undefined" ? JSON.parse(userData) : null
      );
      setLoading(false);
    }
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      // Send the login request
      const response = await fetch("/api/auth/login?action=login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Save the user data and tokens to localStorage
      localStorage.setItem("token", data.user.token); // Access the token correctly
      localStorage.setItem("chatToken", data.chatToken); // Store chat token for chat usage
      localStorage.setItem("userId", data.user.id); // Store user ID for chat initialization
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(data.user));

      // Set authentication state in the app
      setUser(data.user);
      setIsAuthenticated(true);
      setError(null);

      // Navigate to dashboard after successful login
      router.push("/Dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // Signup function
  const signup = async (userData: FormData) => {
    try {
      // Send the request to the signup API
      const response = await fetch("/api/auth/signup?action=signup", {
        method: "POST",
        body: userData,
      });

      // Check if the response is OK (status in the range 200–299)
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || `Error: ${response.statusText}`);
      }

      // Parse the response as JSON
      const data = await response.json();

      // Update state and localStorage with user info
      if (data && data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify(data.user));
        setError(null);

        // Redirect to the dashboard
        router.push("/account");
      } else {
        throw new Error("User data is missing from the response");
      }
    } catch (error: unknown) {
      // Handle known errors or unexpected ones
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred");
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  // Function to save user profile changes
  const saveProfile = async (updatedUserData: User) => {
    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setError(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  // Logout function
  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/account");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, signup, logout, saveProfile, user }}
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {error && <div className="text-red-500">{error}</div>}
          {children}
        </>
      )}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
