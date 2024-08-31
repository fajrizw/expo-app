import { StyleSheet } from "react-native";
import { Text, View } from "@/components/Themed";
import ProductList from "@/components/ProductList";
import { useEffect, useState } from "react";
import { fetchProducts } from "@/lib/supabase";
import { useBookmark } from "@/Context/BookmarkContext";

interface Product {
  id: number;
  title: string;
  description: string;
}

export default function BookmarkScreen() {
  const { bookmarkedProducts } = useBookmark();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProductsByIds = async () => {
      try {
        const data = await fetchProducts();
        setFilteredProducts(
          data.filter((product) => bookmarkedProducts.includes(product.id))
        );
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProductsByIds();
  }, [bookmarkedProducts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmarked Products</Text>
      {filteredProducts.length > 0 ? (
        <ProductList
          products={filteredProducts}
          onDelete={() => {}}
          onUpdate={() => {}}
          onBookmark={() => {}}
        />
      ) : (
        <Text>No bookmarked products available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
