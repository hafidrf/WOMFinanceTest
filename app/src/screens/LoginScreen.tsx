import { useEffect, useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { AuthSessionResult } from "expo-auth-session";
import { AppInput } from "../components/AppInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { appColors } from "../theme/colors";
import { useGoogleAuthRequest } from "../services/googleAuth";

type ValidationErrors = {
  email?: string;
  password?: string;
};

export function LoginScreen() {
  const { loginWithPassword, loginWithGoogleToken } = useAuth();
  const { request, response, promptAsync, hasClientConfig } = useGoogleAuthRequest();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);

  useEffect(() => {
    async function handleGoogleResponse() {
      if (!response || response.type !== "success") return;

      const { authentication } = response;
      if (!authentication?.accessToken) {
        Alert.alert("Google login gagal", "Access token tidak ditemukan.");
        return;
      }

      let userEmail = "google-user@example.com";
      try {
        const meResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
          headers: {
            Authorization: `Bearer ${authentication.accessToken}`,
          },
        });
        if (meResponse.ok) {
          const meData = (await meResponse.json()) as { email?: string };
          if (meData.email) userEmail = meData.email;
        }
      } catch {
        // Fallback email is still acceptable for session display.
      }

      const expiresAt = authentication.expiresIn
        ? Date.now() + authentication.expiresIn * 1000
        : Date.now() + 60 * 60 * 1000;

      await loginWithGoogleToken(userEmail, authentication.accessToken, expiresAt);
    }

    void handleGoogleResponse();
  }, [loginWithGoogleToken, response]);

  function validate(): boolean {
    const nextErrors: ValidationErrors = {};
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) nextErrors.email = "Email wajib diisi.";
    else if (!/\S+@\S+\.\S+/.test(normalizedEmail)) nextErrors.email = "Format email tidak valid.";

    if (!password) nextErrors.password = "Password wajib diisi.";
    else if (password.length < 6) nextErrors.password = "Password minimal 6 karakter.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onLoginPress() {
    if (!validate()) return;

    try {
      setLoading(true);
      await loginWithPassword(email);
    } catch {
      Alert.alert("Login gagal", "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleLoginPress() {
    if (!hasClientConfig) {
      Alert.alert(
        "Google OAuth belum dikonfigurasi",
        "Isi env EXPO_PUBLIC_GOOGLE_*_CLIENT_ID agar login Google dapat dijalankan."
      );
      return;
    }

    try {
      setGoogleLoading(true);
      const result = (await promptAsync()) as AuthSessionResult;
      if (result.type !== "success" && result.type !== "dismiss" && result.type !== "cancel") {
        Alert.alert("Google login gagal", "Silakan coba lagi.");
      }
    } catch {
      Alert.alert("Google login gagal", "Terjadi kesalahan saat membuka OAuth.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: palette.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>
          <Text style={[styles.title, { color: palette.textPrimary }]}>Welcome</Text>
          <Text style={[styles.subtitle, { color: palette.textSecondary }]}>Masuk untuk melihat daftar produk.</Text>

          <View style={styles.form}>
            <AppInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="you@example.com"
              errorText={errors.email}
            />
            <AppInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Minimal 6 karakter"
              errorText={errors.password}
            />
            <PrimaryButton title="Login" onPress={onLoginPress} loading={loading} />
            <PrimaryButton
              title="Login with Google"
              onPress={onGoogleLoginPress}
              loading={googleLoading}
              disabled={!request}
              variant="outline"
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
  },
  form: {
    gap: 14,
  },
});
