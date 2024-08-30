import {
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Button,
  FlatList,
  Dimensions,
  Alert,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import {
  supabase,
  fetchProducts,
  createProduct,
  deleteProduct,
} from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";

import { useNavigation } from "@react-navigation/native";

import { router, useLocalSearchParams } from "expo-router";
import ProductList from "@/components/ProductList";

const numColumns = 2;
interface Product {
  id: number;
  title: string;
  description: string;
}
export default function TabOneScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

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
  async function fetchProfile() {
    try {
      setLoading(true);
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.user) {
        // User is not authenticated
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
  }

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
      loadProducts();
    }, [])
  );

  if (loading) {
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

          <Button title="Create New Product" onPress={handleCreateProduct} />
        </View>
      ) : (
        <Text>No profile data available.</Text>
      )}

      <ProductList
        products={products}
        onDelete={handleDeleteProduct}
        onUpdate={handleUpdateProduct}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
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
  profileText: {
    fontSize: 28,
    marginVertical: 2,
    paddingLeft: 13,
    fontWeight: "semibold",
  },
});
