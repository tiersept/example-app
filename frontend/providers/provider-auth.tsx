import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
} from "@/constants/secure-store";
import { $api } from "@/lib/client";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { paths } from "../../lib/types/schema";

type LoginParams =
  paths["/login"]["post"]["requestBody"]["content"]["application/json"];
type LoginReturnType =
  paths["/login"]["post"]["responses"]["200"]["content"]["application/json"];
type AuthState = LoginReturnType & { isAuthenticated: boolean };

interface AuthProps {
  authState: AuthState;
  onLogin?: (
    { username, password }: LoginParams,
    onError: (error: any) => void
  ) => Promise<any>;
  onLogout?: () => void;
}

const initialAuthState = {
  token: undefined,
  refreshToken: undefined,
  isAuthenticated: false,
};

const AuthContext = createContext<AuthProps>({ authState: initialAuthState });

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProviderAuth = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);

  const loginMutation = $api.useMutation("post", "/login", {
    async onSuccess(data, variables, context) {
      console.log("success!", { data, variables, context });
      if (!data || !data.token || !data.refreshToken) return;

      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, data.token);
      await SecureStore.setItemAsync(AUTH_REFRESH_TOKEN_KEY, data.refreshToken);

      setAuthState({
        ...data,
        isAuthenticated: true,
      });

      router.replace("/");
    },
    onError(error, variables, context) {
      console.log("error!", { error, variables, context });
    },
  });

  const onLogin = async (
    { username, password }: LoginParams,
    onError: (error: any) => void
  ) => {
    return loginMutation.mutate(
      { body: { username, password } },
      {
        onError: (error) => {
          onError(error);
        },
      }
    );
  };

  const onLogout = async () => {
    try {
      // Clear stored tokens
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(AUTH_REFRESH_TOKEN_KEY);

      // Clear local state
      setAuthState({
        token: undefined,
        refreshToken: undefined,
        isAuthenticated: false,
      });

      // Redirect to sign-in page
      router.replace("/sign-in");
    } catch (error) {
      console.warn("Failed to clear stored tokens:", error);
      // Still clear local state and redirect even if clearing storage fails
      setAuthState({
        token: undefined,
        refreshToken: undefined,
        isAuthenticated: false,
      });
      router.replace("/sign-in");
    }
  };

  const value = {
    authState,
    onLogin,
    onLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
