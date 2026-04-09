import { useMemo } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { appColors } from "../theme/colors";

type StateViewProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function StateView({ title, description, actionLabel, onActionPress }: StateViewProps) {
  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: palette.textPrimary }]}>{title}</Text>
      {description ? <Text style={[styles.description, { color: palette.textSecondary }]}>{description}</Text> : null}
      {actionLabel && onActionPress ? <PrimaryButton title={actionLabel} onPress={onActionPress} size="sm" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 8,
  },
});
