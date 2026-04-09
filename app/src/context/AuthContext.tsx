import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { AuthSession, clearSession, createCustomSession, loadSession, saveSession } from "../services/authStorage";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  loginWithPassword: (email: string) => Promise<void>;
  loginWithGoogleToken: (email: string, token: string, expiresAt?: number) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const storedSession = await loadSession();
        setSession(storedSession);
      } finally {
        setLoading(false);
      }
    }

    void bootstrap();
  }, []);

  const loginWithPassword = useCallback(async (email: string) => {
    const newSession = await createCustomSession(email.trim().toLowerCase());
    await saveSession(newSession);
    setSession(newSession);
  }, []);

  const loginWithGoogleToken = useCallback(async (email: string, token: string, expiresAt?: number) => {
    const googleSession: AuthSession = {
      email: email.trim().toLowerCase(),
      token,
      tokenType: "google",
      expiresAt: expiresAt ?? Date.now() + 60 * 60 * 1000,
    };
    await saveSession(googleSession);
    setSession(googleSession);
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      loading,
      loginWithPassword,
      loginWithGoogleToken,
      logout,
    }),
    [loading, loginWithGoogleToken, loginWithPassword, logout, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
