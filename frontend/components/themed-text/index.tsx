import { FONT_SIZE } from "@/constants/font-size";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    | "default"
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "body"
    | "bodyBold"
    | "small"
    | "smallBold"
    | "link";
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    "foreground"
  );

  return (
    <Text
      style={[
        { color },
        type === "default" ? styles.default : undefined,
        type === "h1" ? styles.h1 : undefined,
        type === "h2" ? styles.h2 : undefined,
        type === "h3" ? styles.h3 : undefined,
        type === "h4" ? styles.h4 : undefined,
        type === "body" ? styles.body : undefined,
        type === "bodyBold" ? styles.bodyBold : undefined,
        type === "small" ? styles.small : undefined,
        type === "smallBold" ? styles.smallBold : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "SF-Pro-Regular-400",
    fontSize: FONT_SIZE.base,
    // 1.5x line height for body text provides optimal readability for longer text
    lineHeight: FONT_SIZE.base * 1.5,
  },
  h1: {
    fontFamily: "SF-Pro-Expanded-900",
    fontSize: FONT_SIZE["4xl"],
    // 1.25x line height for headings creates tighter, more compact spacing
    lineHeight: FONT_SIZE["4xl"] * 1.25,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: "SF-Pro-Expanded-900",
    fontSize: FONT_SIZE["3xl"],
    lineHeight: FONT_SIZE["3xl"] * 1.25,
    letterSpacing: -0.25,
  },
  h3: {
    fontFamily: "SF-Pro-Expanded-900",
    fontSize: FONT_SIZE["2xl"],
    lineHeight: FONT_SIZE["2xl"] * 1.25,
  },
  h4: {
    fontFamily: "SF-Pro-Expanded-900",
    fontSize: FONT_SIZE.xl,
    lineHeight: FONT_SIZE.xl * 1.25,
  },
  body: {
    fontFamily: "SF-Pro-Regular-400",
    fontSize: FONT_SIZE.base,
    lineHeight: FONT_SIZE.base * 1.5,
  },
  bodyBold: {
    fontFamily: "SF-Pro-Bold-700",
    fontSize: FONT_SIZE.base,
    lineHeight: FONT_SIZE.base * 1.5,
  },
  small: {
    fontFamily: "SF-Pro-Regular-400",
    fontSize: FONT_SIZE.sm,
    lineHeight: FONT_SIZE.sm * 1.5,
  },
  smallBold: {
    fontFamily: "SF-Pro-Bold-700",
    fontSize: FONT_SIZE.sm,
    lineHeight: FONT_SIZE.sm * 1.5,
    fontWeight: 600,
  },
  link: {
    fontFamily: "SF-Pro",
    fontSize: FONT_SIZE.base,
    lineHeight: FONT_SIZE.base * 1.5,
    color: "#5947e1", // primary color
    textDecorationLine: "underline",
  },
});
