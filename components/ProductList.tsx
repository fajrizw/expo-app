import React from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";

const numColumns = 2;
const ProductList = ({
  products,
  onDelete,
  onUpdate,
}: {
  products: any[];
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
}) => {
  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Button title="Update" onPress={() => onUpdate(item.id)} />
      <Button title="Delete" onPress={() => onDelete(item.id)} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderProduct}
      numColumns={numColumns}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    width: (Dimensions.get("window").width - 40) / numColumns,
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
  listContainer: {
    paddingBottom: 20,
  },
});

export default ProductList;
