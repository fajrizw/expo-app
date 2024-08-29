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