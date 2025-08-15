import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/icon-symbol";
import TabBarBackground from "@/components/tab-background-color";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

export default function TabLayout() {
  const colorPrimary = useThemeColor({}, "primary");
  const colorMutedForeground = useThemeColor({}, "mutedForeground");

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorPrimary,
        tabBarInactiveTintColor: colorMutedForeground,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="(accounts)"
        options={{
          title: "Accounts",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="creditcard.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="gear" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
