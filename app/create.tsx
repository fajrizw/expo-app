import React from "react";
import CreateProduct from "@/components/CreateProduct";
import { router } from "expo-router";

export default function CreateProductScreen() {
  return (
    <CreateProduct
      onProductCreated={() => {
        router.back();
      }}
    />
  );
}
