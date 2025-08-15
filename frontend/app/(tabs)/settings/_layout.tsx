import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </Stack>
  );
};

export default Layout;
