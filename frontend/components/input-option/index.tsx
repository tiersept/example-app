import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../themed-text";

export interface OptionConfig {
  id: string;
  symbol?: string;
  name: string;
  code?: string;
  [key: string]: any;
}

export interface OptionProps {
  option: OptionConfig;
  isSelected: boolean;
  onSelect: (optionId: string) => void;
  showSymbol?: boolean;
  showCode?: boolean;
  symbolKey?: string;
  nameKey?: string;
  codeKey?: string;
  style?: StyleProp<ViewStyle>;
}

export const InputOption = ({
  option,
  isSelected,
  onSelect,
  showSymbol = true,
  showCode = true,
  symbolKey = "symbol",
  nameKey = "name",
  codeKey = "code",
  style,
}: OptionProps) => {
  const symbol = option[symbolKey];
  const name = option[nameKey];
  const code = option[codeKey];

  return (
    <TouchableOpacity
      style={[styles.option, style]}
      onPress={() => onSelect(option.id)}
      accessible={true}
      accessibilityLabel={`Select ${name}`}
      accessibilityHint={`Selects ${name}`}
      accessibilityRole="button"
      accessibilityState={{
        selected: isSelected,
      }}
    >
      <View style={styles.optionContent}>
        <View style={styles.optionInfo}>
          {showSymbol && symbol && (
            <ThemedText type="bodyBold" style={styles.optionSymbol}>
              {symbol}
            </ThemedText>
          )}
          <View style={styles.optionDetails}>
            <ThemedText type="bodyBold" style={styles.optionName}>
              {name}
            </ThemedText>
            {showCode && code && (
              <ThemedText type="small" style={styles.optionCode}>
                {code}
              </ThemedText>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    borderRadius: 16,
    padding: 16,
    minHeight: 72,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  optionSymbol: {
    fontSize: 24,
    marginRight: 16,
    minWidth: 32,
    textAlign: "center",
  },
  optionDetails: {
    flex: 1,
  },
  optionName: {
    marginBottom: 2,
  },
  optionCode: {
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
