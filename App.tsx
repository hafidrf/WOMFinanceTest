import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { appColors } from "./src/theme/colors";

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const navTheme = isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: appColors.dark.background,
          card: appColors.dark.surface,
          text: appColors.dark.textPrimary,
          border: appColors.dark.border,
          primary: appColors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: appColors.light.background,
          card: appColors.light.surface,
          text: appColors.light.textPrimary,
          border: appColors.light.border,
          primary: appColors.primary,
        },
      };

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style={isDark ? "light" : "dark"} />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
