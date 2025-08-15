import { CardAccount } from "@/components/card-account";
import { CardAccountOverview } from "@/components/card-account-overview";
import { ThemedText } from "@/components/themed-text";
import { FONT_SIZE } from "@/constants/font-size";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useThemeColor } from "@/hooks/useThemeColor";
import { $api } from "@/lib/client";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  PlatformColor,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const insets = useSafeAreaInsets();

  const {
    data: accounts,
    error,
    isLoading,
    refetch,
  } = $api.useQuery("get", "/accounts");

  useRefreshOnFocus(refetch);

  const colorBackground = useThemeColor({}, "background");
  const colorPrimaryForeground = useThemeColor({}, "primaryForeground");
  const colorAccent = useThemeColor({}, "accent");

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colorBackground }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colorAccent} />
          <ThemedText type="bodyBold">Loading your accounts...</ThemedText>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colorBackground }]}>
        <View style={styles.errorContainer}>
          <ThemedText type="bodyBold" style={styles.errorTitle}>
            Oops! Something went wrong
          </ThemedText>
          <Text style={styles.errorText}>
            Unable to load your accounts. Please try again later.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Your accounts",
          headerLargeTitle: true,
          headerShown: true,
          headerTransparent: true,
          headerBlurEffect: "systemUltraThinMaterial",
           
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
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          // We shouldnt have to add padding manually in combination with headerLargeTitle. For the sake of this demo...
          // Known bug https://github.com/software-mansion/react-native-screens/issues/2801#event-17296347519
          { paddingTop: insets.top * 2.8 },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colorAccent}
            colors={[colorPrimaryForeground, colorAccent]}
          />
        }
      >
        {accounts && accounts?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>No accounts found</ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Your accounts will appear here once set up
            </ThemedText>
          </View>
        ) : (
          <>
            <CardAccountOverview
              totalBalance={
                accounts?.reduce(
                  (total, account) => total + (account.balance || 0),
                  0
                ) || 0
              }
            />
            <View style={styles.accountContainer}>
              {accounts?.map((account) => (
                <Link
                  key={account.id}
                  href={{
                    pathname: "/(tabs)/(accounts)/[id]",
                    params: { id: account.id ?? "", name: account.name },
                  }}
                >
                  <CardAccount name={account.name} balance={account.balance} />
                </Link>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    gap: 24,
  },
  accountContainer: {
    flex: 1,
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    textAlign: "center",
  },
});
