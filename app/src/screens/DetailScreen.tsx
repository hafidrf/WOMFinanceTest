import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { ProductCard } from "../components/ProductCard";
import { StateView } from "../components/StateView";
import { fetchProductById } from "../services/productsApi";
import { appColors } from "../theme/colors";
import { Product } from "../types/api";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Detail">;

export function DetailScreen({ route }: Props) {
  const { productId, fallbackProduct } = route.params;
  const [product, setProduct] = useState<Product | null>(fallbackProduct ?? null);
  const [loading, setLoading] = useState(!fallbackProduct);
  const [error, setError] = useState<string | null>(null);

  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);

  const loadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProductById(productId);
      setProduct(data);
    } catch {
      setError("Gagal memuat detail produk.");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    void loadDetail();
  }, [loadDetail]);

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
        <StateView title="Terjadi Kesalahan" description={error} actionLabel="Coba Lagi" onActionPress={() => void loadDetail()} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, backgroundColor: palette.background }}>
        <StateView title="Data Kosong" description="Detail produk tidak ditemukan." />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: palette.background }} contentContainerStyle={styles.content}>
      <ProductCard product={product} />
      <View style={[styles.detailBox, { backgroundColor: palette.surface, borderColor: palette.border }]}>
        <Text style={[styles.sectionTitle, { color: palette.textPrimary }]}>Informasi Produk</Text>
        <Text style={[styles.detailText, { color: palette.textSecondary }]}>Category: {product.category}</Text>
        <Text style={[styles.detailText, { color: palette.textSecondary }]}>Stock: {product.stock}</Text>
        <Text style={[styles.detailText, { color: palette.textSecondary }]}>Rating: {product.rating}</Text>
        <Text style={[styles.detailText, { color: palette.textSecondary }]}>Description: {product.description}</Text>
        <Text style={[styles.noteText, { color: palette.textSecondary }]}>
          Komponen kartu produk di atas adalah komponen reusable yang sama dengan di Home.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 12,
    gap: 12,
  },
  detailBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  detailText: {
    fontSize: 14,
  },
  noteText: {
    marginTop: 4,
    fontSize: 12,
    fontStyle: "italic",
  },
});
