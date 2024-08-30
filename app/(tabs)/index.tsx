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
import UpdateProductScreen from "../update";
import { router, useLocalSearchParams } from "expo-router";

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

  const handleAddProduct = async () => {
    if (title && description) {
      const newProduct = await createProduct(title, description);
      if (newProduct) {
        setTitle(""); // Reset title input
        setDescription(""); // Reset description input

        console.log("Product created, fetching products...");
        await loadProducts();
      }
    } else {
      alert("Please enter both a title and description");
    }
  };

  const handleUpdateProduct = (id: number) => {
    router.push({
      pathname: "../update", // Path to the update page
      params: { id: id.toString() }, // Pass ID as a parameter
    });
  };
  const handleDelete = async (productId: number) => {
    const numericId = parseInt(productId.toString(), 10);

    if (isNaN(numericId)) {
      Alert.alert("Error", "Invalid ID");
      return;
    }

    try {
      const result = await deleteProduct(numericId);
      if (result) {
        Alert.alert("Success", "Product deleted successfully");
        await loadProducts(); // Muat ulang daftar produk
      } else {
        Alert.alert("Error", "Failed to delete product");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
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

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <Button
        title="Update Product"
        onPress={() => handleUpdateProduct(item.id)} // Ganti `productId` dengan ID produk yang ingin di-update
      />
      <Button
        title="Delete Product"
        onPress={() => handleDelete(item.id)} // Pass the correct product ID
      />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );
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

      <TextInput
        style={styles.input}
        placeholder="Product Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Description"
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Add Product" onPress={handleAddProduct} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProduct}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    marginLeft: 13,
    marginRight: 13,
    borderRadius: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: (Dimensions.get("window").width - 40) / numColumns,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#777",
  },
});
