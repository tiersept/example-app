import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: "",
        headerTransparent: true,
      }}
    />
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       headerTitle: "",
    //       headerTransparent: true,
    //     }}
    //   />
    //   <Stack.Screen
    //     name="[id]"
    //     options={{
    //       headerTitle: "",
    //       headerTransparent: true,
    //       headerTintColor: "#fff",
    //     }}
    //   />
    // </Stack>
  );
};

export default Layout;
