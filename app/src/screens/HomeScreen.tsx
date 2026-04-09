import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, useColorScheme, View } from "react-native";
import { ProductCard } from "../components/ProductCard";
import { StateView } from "../components/StateView";
import { useAuth } from "../context/AuthContext";
import { fetchProducts } from "../services/productsApi";
import { appColors } from "../theme/colors";
import { Product } from "../types/api";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function HomeScreen({ navigation }: Props) {
  const { session, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);

  const loadProducts = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      setError("Gagal memuat produk. Cek koneksi internet Anda.");
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => void logout()} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      ),
    });
  }, [logout, navigation]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator size="large" color={appColors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <StateView title="Terjadi Kesalahan" description={error} actionLabel="Coba Lagi" onActionPress={() => void loadProducts()} />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <StateView title="Data Kosong" description="Belum ada produk tersedia." actionLabel="Refresh" onActionPress={() => void loadProducts()} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: palette.background }]}>
      <View style={[styles.emailBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.emailLabel, { color: palette.textSecondary }]}>Logged in as</Text>
        <Text style={[styles.emailValue, { color: palette.textPrimary }]}>{session?.email}</Text>
        <Text style={[styles.helperText, { color: palette.textSecondary }]}>
          Pull down list untuk refresh data.
        </Text>
      </View>
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() =>
              navigation.navigate("Detail", {
                productId: item.id,
                fallbackProduct: item,
              })
            }
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadProducts(true)} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emailBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  emailLabel: {
    fontSize: 12,
  },
  emailValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: "700",
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
  },
  listContent: {
    paddingBottom: 18,
  },
  logoutButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: appColors.primary,
    fontWeight: "700",
  },
});
