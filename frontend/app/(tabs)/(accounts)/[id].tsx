import { ListTransactions } from "@/components/list-transactions";
import { FONT_SIZE } from "@/constants/font-size";
import { Stack, useLocalSearchParams } from "expo-router";
import { Platform, PlatformColor } from "react-native";

const DetailScreenAccount = () => {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();

  return (
    <>
      <Stack.Screen
        options={{
          headerLargeTitle: true,
          headerTitle: name,
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

      <ListTransactions id={parseInt(id)} />
    </>
  );
};

export default DetailScreenAccount;
