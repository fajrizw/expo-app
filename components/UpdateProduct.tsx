import { updateProduct } from "@/lib/supabase";

export const updateProductById = async (
  productId: number,
  title: string,
  description: string
) => {
  try {
    const result = await updateProduct(productId, title, description);
    return result;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
};
