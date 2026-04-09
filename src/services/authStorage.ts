import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const AUTH_STORAGE_KEY = "wom_auth_session";
const ONE_HOUR_MS = 60 * 60 * 1000;

export type AuthSession = {
  email: string;
  token: string;
  tokenType: "custom" | "google";
  expiresAt: number;
};

export async function createCustomSession(email: string): Promise<AuthSession> {
  const token = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    `${email}:${Date.now()}:${Math.random()}`
  );

  return {
    email,
    token,
    tokenType: "custom",
    expiresAt: Date.now() + ONE_HOUR_MS,
  };
}

export async function saveSession(session: AuthSession): Promise<void> {
  await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export async function loadSession(): Promise<AuthSession | null> {
  const rawValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
  if (!rawValue) return null;

  try {
    const parsed = JSON.parse(rawValue) as AuthSession;
    if (Date.now() >= parsed.expiresAt) {
      await clearSession();
      return null;
    }
    return parsed;
  } catch {
    await clearSession();
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
}
