import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://plhfqtqfyksvdvqzrenm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsaGZxdHFmeWtzdmR2cXpyZW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQ4MDA4NjIsImV4cCI6MjA0MDM3Njg2Mn0.-kPfoT-uCUrwD-TEcH1VpcVGVJgiDW34HGxxXEaEvFc"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Read items

export const fetchProducts = async () => {
  try {
    const { data, error } = await supabase.from("products").select();
    if (error) throw error;
    console.log("Data fetched from Supabase:", data); // Debugging
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const createProduct = async (title: string, description: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert([{ title, description }])
      .select();
      
      if (error) {
        console.error("Error creating product:", error);
        throw error; // Rethrow to let caller handle it
      }
  
      console.log("Product created:", data);
      return data;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
export const fetchProductById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
};

export const updateProduct = async (id: number, title: string, description: string) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .update({ title, description })
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error updating product:", error);
      throw error; // Rethrow untuk penanganan oleh pemanggil
    }

    console.log("Product updated:", data);
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};
// Delete an item
export const deleteProduct = async (id: number) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      console.error("Error deleting product:", error);
      throw error;
    }

    console.log("Product deleted:", data);
    return data;
  } catch (error) {
    console.error("Error deleting product:", error);
    return null;
  }
};