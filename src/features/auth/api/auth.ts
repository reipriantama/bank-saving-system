import { useMutation } from "@tanstack/react-query";
import apiClient from "@/shared/lib/axios";
import { AxiosError } from "axios";
import useUserStore from "@/shared/stores/users";

export const fetchLogin = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/login", {
      email,
      password,
    });

    // Store token and user data
    if (response.data?.content?.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("access_token", response.data.content.token);
        // Store user data in Zustand store (auto-persist to localStorage)
        if (response.data?.content?.user) {
          const userData = {
            id: response.data.content.user.id,
            fullName: response.data.content.user.fullName,
            email: response.data.content.user.email,
            role: response.data.content.user.role,
          };
          useUserStore.getState().setUser(userData);
        }
      }
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.errors?.[0] ||
          "Gagal masuk"
      );
    }
    throw error;
  }
};

export const fetchVerifyToken = async (token: string) => {
  try {
    const response = await apiClient.post("/verify-token", {
      token,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.errors?.[0] ||
          "Token verification failed"
      );
    }
    throw error;
  }
};

export const fetchRegister = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await apiClient.post("/register", {
      email,
      fullName: name,
      password,
    });

    if (response.data?.message || response.data?.content) {
      return response.data;
    }

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(
        error.response.data?.message ||
          error.response.data?.errors?.[0] ||
          "Gagal Melakukan Pendaftaran"
      );
    }
    throw error;
  }
};

/**
 * Custom React hook that returns a mutation function for handling user login.
 *
 * This hook utilizes the `useMutation` hook to perform the login operation using the provided `fetchLogin` function.
 * It can be used to trigger login requests and handle their loading, success, and error states.
 *
 * @returns {UseMutationResult} The mutation object for the login operation, including methods and state for managing the mutation.
 *
 * @example
 * const loginMutation = useLoginMutation();
 * loginMutation.mutate({ username: 'user', password: 'pass' });
 */
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: fetchLogin,
  });
};

/**
 * Custom hook that returns a mutation object for user registration.
 *
 * Utilizes the `useMutation` hook with the `fetchRegister` function as the mutation function.
 * This hook can be used to trigger user registration requests and handle their states (loading, error, success).
 *
 * @returns {UseMutationResult} The mutation object for registering a user.
 *
 * @example
 * const registerMutation = useRegisterMutation();
 * registerMutation.mutate({ username: 'user', password: 'pass' });
 */
export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: fetchRegister,
  });
};

/**
 * Custom hook that returns a mutation object for token verification.
 *
 * @returns {UseMutationResult} The mutation object for verifying a token.
 *
 * @example
 * const verifyMutation = useVerifyTokenMutation();
 * verifyMutation.mutate('token-string');
 */
export const useVerifyTokenMutation = () => {
  return useMutation({
    mutationFn: fetchVerifyToken,
  });
};

/**
 * Get stored access token
 * @returns Access token from localStorage or null
 */
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};

/**
 * Check if user is authenticated (has valid token)
 * @returns Boolean indicating if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};
