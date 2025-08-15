import { Platform } from "react-native";

// These would be set in an env
export const getBaseApiUrl = () => {
  if (__DEV__) {
    // Development URLs
    if (Platform.OS === "android") {
      return "http://10.0.2.2:3001";
    } else if (Platform.OS === "ios") {
      return "http://localhost:3001";
    }
  }
  return "https://someproductionurl.com";
};
