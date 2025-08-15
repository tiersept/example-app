import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

type ButtonProps = {
  onPress: () => void;
  title: string;
  type?: "primary" | "secondary" | "destructive";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: "button" | "link" | "none";
};

export const Button = ({
  onPress,
  title,
  type = "primary",
  style,
  textStyle,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = "button",
}: ButtonProps) => {
  const primary = useThemeColor({}, "primary");
  const primaryForeground = useThemeColor({}, "primaryForeground");
  const destructive = useThemeColor({}, "destructive");
  const destructiveForeground = useThemeColor({}, "destructiveForeground");

  return (
    <TouchableOpacity
      style={[
        styles.button,
        type === "primary"
          ? { backgroundColor: primary }
          : type === "destructive"
          ? { backgroundColor: destructive }
          : {
              backgroundColor: "transparent",
              borderColor: primary,
              borderWidth: 1,
            },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessible={true}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        disabled: disabled,
      }}
    >
      <ThemedText
        style={[
          type === "primary"
            ? { color: primaryForeground }
            : type === "destructive"
            ? { color: destructiveForeground }
            : { color: primary },
          textStyle,
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: 24,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  disabled: {
    opacity: 0.5,
  },
});
