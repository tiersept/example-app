import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { IconSymbol } from "../icon-symbol";
import { ThemedText } from "../themed-text";

interface Props {
  totalBalance: number;
}

export const CardAccountOverview = ({ totalBalance }: Props) => {
  const { format } = useCurrencyFormat();

  const colorPrimary = useThemeColor({}, "primary");
  const colorPrimaryForeground = useThemeColor({}, "primaryForeground");

  return (
    <View
      style={[
        styles.cardAccount,
        {
          backgroundColor: colorPrimary,
          borderColor: colorPrimaryForeground,
        },
      ]}
    >
      {/* Header with icon and title */}
      <View style={styles.header}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colorPrimaryForeground },
          ]}
        >
          <IconSymbol name="banknote" size={24} color={colorPrimary} />
        </View>
        <View style={styles.titleContainer}>
          <ThemedText
            type="smallBold"
            style={[styles.label, { color: colorPrimaryForeground }]}
          >
            TOTAL BALANCE
          </ThemedText>
          <ThemedText type="h3" style={{ color: colorPrimaryForeground }}>
            {format.currency(totalBalance ?? 0)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardAccount: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  titleContainer: {
    flex: 1,
  },
  label: {
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 0,
    opacity: 0.8,
  },
  changeContainer: {
    marginBottom: 16,
  },
  changeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  changeText: {
    marginLeft: 6,
    marginRight: 8,
    fontWeight: "700",
  },
  changePercentage: {
    fontWeight: "600",
  },
  period: {
    opacity: 0.7,
    fontSize: 12,
  },
  decorativeElements: {
    position: "absolute",
    top: 20,
    right: 20,
    alignItems: "center",
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
});
