import { Button } from "@/components/button";
import { InputOption } from "@/components/input-option";
import { ThemedText } from "@/components/themed-text";
import { SUPPORTED_CURRENCIES, type CurrencyCode } from "@/constants/currency";
import { FONT_SIZE } from "@/constants/font-size";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/providers/provider-auth";
import { useCurrency } from "@/providers/provider-currency";
import { Stack } from "expo-router";
import {
  Alert,
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Settings() {
  const insets = useSafeAreaInsets();

  const { currentCurrency, setCurrency } = useCurrency();

  const { onLogout } = useAuth();

  const backgroundColor = useThemeColor({}, "background");
  const cardBackground = useThemeColor({}, "card");
  const borderColor = useThemeColor({}, "border");
  const mutedTextColor = useThemeColor({}, "mutedForeground");

  const handleCurrencyChange = async (newCurrency: CurrencyCode) => {
    if (newCurrency === currentCurrency) return;

    setCurrency(newCurrency);
  };

  // Transform currency data to match OptionConfig interface
  const currencyOptions = Object.entries(SUPPORTED_CURRENCIES).map(
    ([code, currency]) => ({
      id: code,
      symbol: currency.symbol,
      name: currency.name,
      code: currency.code,
    })
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Settings",
          headerLargeTitle: true,
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "systemUltraThinMaterial",
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          headerLargeStyle: Platform.select({
            ios: {
              backgroundColor: PlatformColor("systemGroupedBackgroundColor"),
            },
          }),
          headerLargeTitleStyle: {
            fontFamily: "SF-Pro-Expanded-900",
            fontSize: FONT_SIZE["2xl"],
          },
          headerTitleStyle: {
            fontFamily: "SF-Pro-Expanded-900",
          },
        }}
      />
      <ScrollView
        style={[styles.container, { backgroundColor }]}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingTop: insets.top * 2.8 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText
              type="body"
              style={[styles.sectionDescription, { color: mutedTextColor }]}
            >
              Choose your preferred currency for displaying amounts and
              transactions
            </ThemedText>
          </View>

          <View style={styles.currencyOptions}>
            {currencyOptions.map((option) => (
              <InputOption
                key={option.id}
                option={option}
                isSelected={option.id === currentCurrency}
                onSelect={(optionId) =>
                  handleCurrencyChange(optionId as CurrencyCode)
                }
                style={[
                  styles.currencyOption,
                  {
                    backgroundColor: cardBackground,
                    borderColor:
                      option.id === currentCurrency
                        ? useThemeColor({}, "primary")
                        : borderColor,
                    borderWidth: option.id === currentCurrency ? 2 : 1,
                  },
                ]}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View
            style={[
              styles.logoutCard,
              { backgroundColor: cardBackground, borderColor },
            ]}
          >
            <View style={styles.logoutContent}>
              <View style={styles.logoutInfo}>
                <ThemedText type="bodyBold" style={styles.logoutTitle}>
                  Sign out
                </ThemedText>
                <ThemedText
                  type="small"
                  style={[styles.logoutDescription, { color: mutedTextColor }]}
                >
                  Sign out of your account and return to the login screen
                </ThemedText>
              </View>
            </View>

            <Button
              title="Sign out"
              type="destructive"
              onPress={() => {
                Alert.alert("Sign out", "Are you sure you want to sign out?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Sign out",
                    style: "destructive",
                    onPress: onLogout,
                  },
                ]);
              }}
              style={styles.logoutButton}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  sectionDescription: {
    lineHeight: 20,
  },
  currencyOptions: {
    gap: 12,
    marginBottom: 24,
  },
  currencyOption: {
    borderRadius: 16,
    padding: 16,
    minHeight: 72,
  },
  previewSection: {
    marginTop: 8,
  },
  previewTitle: {
    marginBottom: 16,
  },
  previewCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  previewLabel: {
    marginBottom: 8,
  },
  previewAmount: {
    marginBottom: 8,
  },
  previewNote: {
    fontStyle: "italic",
  },
  aboutCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  aboutText: {
    lineHeight: 22,
  },
  logoutCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  logoutContent: {
    marginBottom: 16,
  },
  logoutInfo: {
    marginBottom: 0,
  },
  logoutTitle: {
    marginBottom: 4,
  },
  logoutDescription: {
    lineHeight: 18,
  },
  logoutButton: {
    alignSelf: "stretch",
  },
});
