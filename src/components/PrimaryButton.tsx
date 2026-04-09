import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { appColors } from "../theme/colors";

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "outline";
  size?: "md" | "sm";
};

export function PrimaryButton({ title, onPress, loading, disabled, variant = "primary", size = "md" }: PrimaryButtonProps) {
  const isOutline = variant === "outline";
  const isDisabled = disabled || loading;
  const isSmall = size === "sm";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        isSmall ? styles.small : styles.medium,
        isOutline ? styles.outline : styles.primary,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? appColors.primary : "#FFFFFF"} />
      ) : (
        <Text style={[styles.text, isOutline && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  medium: {
    minHeight: 46,
  },
  small: {
    minHeight: 36,
    paddingHorizontal: 12,
  },
  primary: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  outline: {
    backgroundColor: "transparent",
    borderColor: appColors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  outlineText: {
    color: appColors.primary,
  },
});
