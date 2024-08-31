import { StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState, useCallback } from "react";
import { Text, View } from "@/components/Themed";
import { supabase, fetchProducts, deleteProduct } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { router, useLocalSearchParams } from "expo-router";
import ProductList from "@/components/ProductList";
import { useBookmark } from "@/Context/BookmarkContext";

interface Product {
  id: number;
  title: string;
  description: string;
}

export default function TabOneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { bookmarkedProducts, toggleBookmark } = useBookmark();

  const [fontsLoaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-SemiBold.ttf"),
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      if (!session?.user) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("username, website, avatar_url")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    await deleteProduct(id);
    await loadProducts();
  };

  const handleUpdateProduct = (id: number) => {
    router.push({ pathname: "../update", params: { id: id.toString() } });
  };

  const handleCreateProduct = () => {
    router.push("/create");
  };

  const handleBookmarkProduct = (id: number) => {
    toggleBookmark(id);
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      const sortedData = data.sort((a, b) => a.id - b.id);
      console.log("Products fetched:", data);
      setProducts(sortedData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      loadProducts();
    }, [])
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      {profile ? (
        <View>
          <Text style={styles.profileText}>{profile.username}</Text>
        </View>
      ) : (
        <Text>No profile data available.</Text>
      )}

      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onUpdate={handleUpdateProduct}
        onBookmark={handleBookmarkProduct}
      />
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={handleCreateProduct}>
          <Text style={styles.buttonText}>Create New Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            router.push("/bookmark");
          }}
        >
          <Text style={styles.buttonText}>Go to Bookmark</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    paddingLeft: 13,
    fontWeight: "100",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
    alignSelf: "center",
    width: "auto",
    minWidth: 150,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 28,
    marginVertical: 2,
    paddingLeft: 13,
    fontWeight: "semibold",
  },
});
