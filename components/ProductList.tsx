import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { useBookmark } from "@/Context/BookmarkContext";

interface Product {
  id: number;
  title: string;
  description: string;
}

interface ProductListProps {
  products: Product[];
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  onBookmark: (id: number) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  onDelete,
  onUpdate,
  onBookmark,
}) => {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <TouchableOpacity style={styles.button} onPress={() => onUpdate(item.id)}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onDelete(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isBookmarked(item.id) ? "#FF5722" : "#007BFF" },
        ]}
        onPress={() => {
          onBookmark(item.id);
        }}
      >
        <Text style={styles.buttonText}>
          {isBookmarked(item.id) ? "Unbookmark" : "Bookmark"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </View>
  );

  if (Platform.OS === "web") {
    return (
      <ScrollView
        contentContainerStyle={styles.gridContainer}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
      >
        {products.map((product) => (
          <View key={product.id} style={styles.card}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onUpdate(product.id)}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => onDelete(product.id)}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: isBookmarked(product.id)
                    ? "#FF5722"
                    : "#007BFF",
                },
              ]}
              onPress={() => {
                onBookmark(product.id);
              }}
            >
              <Text style={styles.buttonText}>
                {isBookmarked(product.id) ? "Unbookmark" : "Bookmark"}
              </Text>
            </TouchableOpacity>
            <Text style={styles.cardTitle}>{product.title}</Text>
            <Text style={styles.cardDescription}>{product.description}</Text>
          </View>
        ))}
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderProduct}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: Platform.OS === "web" ? "flex-start" : "space-between", // Use flex-start for web
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    marginHorizontal: 5,
    width: Platform.select({
      web: (Dimensions.get("window").width - 40) / 2 - 10,
      default: (Dimensions.get("window").width - 40) / 2,
    }),
    maxWidth: 300,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
});

export default ProductList;
