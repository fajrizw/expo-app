import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { createProduct } from "@/lib/supabase";

const CreateProduct = ({
  onProductCreated,
}: {
  onProductCreated: () => void;
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleAddProduct = async () => {
    if (title && description) {
      const newProduct = await createProduct(title, description);
      if (newProduct) {
        setTitle("");
        setDescription("");
        onProductCreated(); // Notify parent component to reload the products list
      } else {
        alert("Failed to create product");
      }
    } else {
      alert("Please enter both a title and description");
    }
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default CreateProduct;
