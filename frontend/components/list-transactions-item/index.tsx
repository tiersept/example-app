import { useCurrencyFormat } from "@/hooks/useCurrencyFormat";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatDate } from "@/util/format-date";
import { StyleSheet, View } from "react-native";
import { TransactionItem } from "../../../lib/types";
import { ThemedText } from "../themed-text";

export const ListTransactionItem = ({
  amount,
  type,
  description,
  date,
}: TransactionItem) => {
  const { format } = useCurrencyFormat();

  const colorCard = useThemeColor({}, "card");
  const colorCardForeground = useThemeColor({}, "cardForeground");
  const colorTextSecondary = useThemeColor({}, "mutedForeground");

  const getAmountColor = (amount?: number, type?: string) => {
    if (!amount) return colorCardForeground;
    if (type === "credit" || amount > 0) return "#22C55E";
    if (type === "debit" || amount < 0) return "#EF4444";
    return colorCardForeground;
  };

  return (
    <View
      style={[
        styles.transactionItem,
        {
          backgroundColor: colorCard,
        },
      ]}
    >
      <View style={styles.transactionInfo}>
        <ThemedText type="bodyBold" style={{ color: colorCardForeground }}>
          {description || "No Description"}
        </ThemedText>
        <ThemedText
          type="small"
          style={{ color: colorTextSecondary, marginTop: 4 }}
        >
          {formatDate(date)}
        </ThemedText>
      </View>
      <View style={styles.amountContainer}>
        <ThemedText
          type="bodyBold"
          style={{
            color: getAmountColor(amount, type),
            textAlign: "right",
          }}
        >
          {format.currency(amount ?? 0)}
        </ThemedText>
        {type && (
          <ThemedText
            type="small"
            style={{
              color: colorTextSecondary,
              marginTop: 4,
              textAlign: "right",
              textTransform: "capitalize",
            }}
          >
            {type}
          </ThemedText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    marginBottom: 8,
  },
  transactionInfo: {
    flex: 1,
    marginRight: 16,
  },
  amountContainer: {
    alignItems: "flex-end",
    minWidth: 80,
  },
});
