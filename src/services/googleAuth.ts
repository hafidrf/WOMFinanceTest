import * as Google from "expo-auth-session/providers/google";
import { useMemo } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

/** Expo web strips trailing slash; Google OAuth requires exact redirect URI match. */
function webRedirectUri(): string | undefined {
  if (Platform.OS !== "web" || typeof window === "undefined") return undefined;
  return window.location.origin.replace(/\/$/, "");
}

export function useGoogleAuthRequest() {
  const expoClientId = process.env.EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

  const hasClientConfig = useMemo(
    () => Boolean(expoClientId || androidClientId || iosClientId || webClientId),
    [androidClientId, expoClientId, iosClientId, webClientId]
  );

  const redirectUri = useMemo(() => webRedirectUri(), []);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: expoClientId ?? androidClientId ?? iosClientId ?? webClientId ?? "",
    androidClientId,
    iosClientId,
    webClientId,
    scopes: ["profile", "email"],
    redirectUri,
  });

  return { request, response, promptAsync, hasClientConfig };
}
