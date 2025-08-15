import {
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
} from "@/constants/secure-store";
import * as SecureStore from "expo-secure-store";
import createFetchClient, { type Middleware } from "openapi-fetch";
import { Platform } from "react-native";
import { paths } from "../../../lib/types/schema";
import { postRefreshToken } from "../api/post-refresh-token";

const UNPROTECTED_ROUTES = ["/login", "/logout"];

// Helper function to check if JWT token is expired
function isTokenExpired(token: string, bufferMinutes: number = 1): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    const bufferTime = bufferMinutes * 60;
    return payload.exp < currentTime + bufferTime;
  } catch {
    return true;
  }
}

// Helper function to refresh tokens
async function refreshTokens() {
  try {
    const refreshToken = await SecureStore.getItemAsync(AUTH_REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return null;
    }

    const response = await postRefreshToken(refreshToken);
    if (response.data) {
      const { token, refreshToken: newRefreshToken } = response.data;

      // Store new tokens
      if (token) {
        await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
      }
      if (newRefreshToken) {
        await SecureStore.setItemAsync(AUTH_REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return { token: token, refreshToken: newRefreshToken };
    }
    return null;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    return null;
  }
}

const authMiddleware: Middleware = {
  async onRequest({ schemaPath, request }) {
    if (
      UNPROTECTED_ROUTES.some((pathname) => schemaPath.startsWith(pathname))
    ) {
      return undefined;
    }

    const authToken = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

    // Proactively check if token is expired (with 5-minute buffer) and refresh if needed
    // This prevents 401 responses and ensures seamless API calls
    if (authToken && isTokenExpired(authToken)) {
      // Token is expired or will expire soon, try to refresh it
      const newTokens = await refreshTokens();
      console.info("fetched new tokens", { newTokens });

      if (newTokens) {
        // Use the new token for this request
        request.headers.set("Authorization", `Bearer ${newTokens.token}`);
        return request;
      } else {
        // Refresh failed, clear tokens and return unauthorized
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(AUTH_REFRESH_TOKEN_KEY);
        throw new Error("Token refresh failed");
      }
    }

    // for all other paths, set Authorization header as expected
    if (authToken) {
      request.headers.set("Authorization", `Bearer ${authToken}`);
    }
    return request;
  },
};

const getBaseUrl = () => {
  if (__DEV__) {
    // Development URLs
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3001";
    } else if (Platform.OS === "ios") {
      return "http://localhost:3001";
    }
  }

  return "https://your-production-api.com";
};

const fetchClient = createFetchClient<paths>({
  baseUrl: getBaseUrl(),
});

fetchClient.use(authMiddleware);

export const client = fetchClient;
