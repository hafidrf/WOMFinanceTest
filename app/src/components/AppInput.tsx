import { useMemo } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, useColorScheme, View } from "react-native";
import { appColors } from "../theme/colors";

type AppInputProps = TextInputProps & {
  label: string;
  errorText?: string;
};

export function AppInput({ label, errorText, ...props }: AppInputProps) {
  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { color: palette.textPrimary }]}>{label}</Text>
      <TextInput
        placeholderTextColor={palette.muted}
        style={[
          styles.input,
          {
            color: palette.textPrimary,
            borderColor: errorText ? appColors.danger : palette.border,
            backgroundColor: palette.surface,
          },
        ]}
        {...props}
      />
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    color: appColors.danger,
    fontSize: 12,
  },
});
