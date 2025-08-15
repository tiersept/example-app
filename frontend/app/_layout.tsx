import { useColorScheme } from "@/hooks/useColorScheme";
import { ProviderAuth, useAuth } from "@/providers/provider-auth";
import { ProviderQueryClient } from "@/providers/provider-query-client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { ProviderCurrency } from "../providers/provider-currency";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    "SF-Pro-Regular-400": require("../assets/fonts/SF-Pro-Regular-400.ttf"),
    "SF-Pro-Bold-700": require("../assets/fonts/SF-Pro-Bold-700.ttf"),
    "SF-Pro-Expanded-900": require("../assets/fonts/SF-Pro-Expanded-900.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <ProviderQueryClient>
        <ProviderAuth>
          <ProviderCurrency>
            <RootNavigator />
          </ProviderCurrency>
        </ProviderAuth>
      </ProviderQueryClient>
    </ThemeProvider>
  );
}

function RootNavigator() {
  const { authState } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={authState.isAuthenticated}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!authState.isAuthenticated}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
