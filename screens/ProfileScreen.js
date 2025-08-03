import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserinfoProfile = async () => {
      try {
        const response = await axios.get(
          "https://trash2treasure-backend.onrender.com/userInfo"
        );
        setUser(response.data);
      } catch (error) {
        setTimeout(() => {
          Alert.alert(error?.response?.data?.message || "An error occured");
        }, 100);
        navigation.navigate("Login");
      }
    };
    getUserinfoProfile();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "https://trash2treasure-backend.onrender.com/logout"
      );
      setTimeout(() => {
        Alert.alert("Logged out");
      }, 100);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Error occured logging out");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          {user ? (
            <Image
              source={{
                uri: `https://trash2treasure-backend.onrender.com/${user.profilePic}`,
              }}
              style={styles.avatar}
            />
          ) : (
            <View>
              <Text>Loading...</Text>
            </View>
          )}
          <Text style={styles.userName}>
            {user ? user.fullNames : "Loading..."}
          </Text>
          <Text style={styles.userHandle}>
            {user ? user.email : "Loading..."}
          </Text>
          {/* Eco Points Card */}
          <LinearGradient
            colors={["#e0f7fa", "#fff"]}
            style={styles.ecoPointsCard}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="leaf"
                size={28}
                color="#00C896"
                style={{ marginRight: 10 }}
              />
              <View>
                <Text
                  style={{ color: "#00C896", fontWeight: "bold", fontSize: 18 }}
                >
                  Eco Points
                </Text>
                <Text
                  style={{ color: "#1B5E20", fontWeight: "bold", fontSize: 28 }}
                >
                  {user ? user.points : "Loading..."}
                </Text>
              </View>
            </View>
            {/* Progress bar to next badge */}
            <View style={{ marginTop: 12 }}>
              <Text style={{ color: "#888", fontSize: 13, marginBottom: 2 }}>
                Progress to next badge
              </Text>
              <View
                style={{
                  height: 12,
                  backgroundColor: "#e0e0e0",
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <LinearGradient
                  colors={["#00C896", "#00A578"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${
                      user && user.ecoPoints
                        ? Math.min(user.ecoPoints / 5, 100)
                        : 10
                    }%`,
                    height: 12,
                  }}
                />
              </View>
              <Text style={{ color: "#1B5E20", fontSize: 12, marginTop: 2 }}>
                Earn 5 more points for your next badge!
              </Text>
            </View>
            {/* Interactive buttons */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("Achievements")}
              >
                <Ionicons name="medal-outline" size={20} color="#00C896" />
                <Text style={styles.actionButtonText}>Achievements</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate("EcoPointsDetails")}
              >
                <Ionicons name="analytics-outline" size={20} color="#00C896" />
                <Text style={styles.actionButtonText}>Eco Points</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Help Center</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Referral")}
          >
            <Ionicons name="people-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Invite Friends</Text>
          </TouchableOpacity>
          <Pressable style={[styles.menuItem, styles.logoutButton]} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#d9534f" />
            <Text style={[styles.menuItemText, { color: "#d9534f" }]}>
              Logout
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b4332",
    marginTop: 15,
  },
  userHandle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 18,
    color: "#1b4332",
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 20,
  },
  ecoPointsCard: {
    marginTop: 18,
    width: "90%",
    alignSelf: "center",
    borderRadius: 18,
    padding: 18,
    elevation: 3,
    shadowColor: "#00C896",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    marginBottom: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    elevation: 1,
  },
  actionButtonText: {
    color: "#00C896",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 15,
  },
});

export default ProfileScreen;
