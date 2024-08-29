import { StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { supabase } from "@/lib/supabase";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function TabOneScreen() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
      setProfile(null); // Clear profile data in case of error
    } finally {
      setLoading(false);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      fetchProfile();
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
      <Text style={styles.title}>Product</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      {profile ? (
        <View>
          <Text style={styles.profileText}>Username: {profile.username}</Text>
          <Text style={styles.profileText}>Website: {profile.website}</Text>
          <Text style={styles.profileText}>
            Avatar URL: {profile.avatar_url}
          </Text>
        </View>
      ) : (
        <Text>No profile data available.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  profileText: {
    fontSize: 16,
    marginVertical: 4,
  },
});
