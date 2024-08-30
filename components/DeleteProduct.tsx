import React from "react";
import { Button, Alert } from "react-native";
import { deleteProduct } from "@/lib/supabase";

interface DeleteProductProps {
  productId: number;
  onProductDeleted: () => void;
}

const DeleteProduct: React.FC<DeleteProductProps> = ({
  productId,
  onProductDeleted,
}) => {
  const handleDelete = async () => {
    try {
      const result = await deleteProduct(productId);
      if (result) {
        Alert.alert("Success", "Product deleted successfully");
        onProductDeleted(); // Notify parent to refresh product list
      } else {
        Alert.alert("Error", "Failed to delete product");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  return <Button title="Delete Product" onPress={handleDelete} />;
};

export default DeleteProduct;
