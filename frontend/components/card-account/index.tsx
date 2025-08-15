import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, View } from "react-native";
import { Account } from "../../../lib/types";
import { ThemedText } from "../themed-text";

export const CardAccount = ({ name, balance }: Account) => {
  const { format } = useCurrencyFormat();

  const colorCard = useThemeColor({}, "card");
  const colorCardForeground = useThemeColor({}, "cardForeground");

  return (
    <View
      style={[
        styles.cardAccount,
        {
          backgroundColor: colorCard,
        },
      ]}
    >
      <View style={styles.accountInfo}>
        <ThemedText type="bodyBold" style={{ color: colorCardForeground }}>
          {name || "Unnamed Account"}
        </ThemedText>
      </View>
      <View style={styles.balanceContainer}>
        <ThemedText type="smallBold" style={{ color: colorCardForeground }}>
          {format.currency(balance ?? 0)}
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardAccount: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  accountInfo: {
    flex: 1,
  },
  accountId: {
    fontWeight: "400",
  },
  balanceContainer: {
    alignItems: "flex-end",
  },
  balanceLabel: {
    marginBottom: 2,
    textTransform: "uppercase",
  },
});
