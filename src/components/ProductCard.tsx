import { memo, useMemo } from "react";
import { Image, Pressable, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Product } from "../types/api";
import { appColors } from "../theme/colors";

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
};

function ProductCardComponent({ product, onPress }: ProductCardProps) {
  const isDark = useColorScheme() === "dark";
  const palette = useMemo(() => (isDark ? appColors.dark : appColors.light), [isDark]);
  const cardContent = (
    <>
      <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={[styles.title, { color: palette.textPrimary }]} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={[styles.description, { color: palette.textSecondary }]} numberOfLines={2}>
          {product.description}
        </Text>
        <View style={styles.metaRow}>
          <Text style={[styles.price, { color: palette.textPrimary }]}>${product.price}</Text>
          <Text style={[styles.rating, { color: palette.textSecondary }]}>Rating {product.rating}</Text>
        </View>
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: palette.surface, borderColor: palette.border },
          pressed && styles.pressed,
        ]}
      >
        {cardContent}
      </Pressable>
    );
  }

  return <View style={[styles.card, { backgroundColor: palette.surface, borderColor: palette.border }]}>{cardContent}</View>;
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.8,
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
  },
  metaRow: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  price: {
    fontWeight: "700",
  },
  rating: {
    fontSize: 12,
  },
});
