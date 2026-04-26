import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";
import axios from "axios";

export default function ReferralScreen({ navigation, route }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // Using dummy user data
    const { dummyUserProfile } = require('../utils/dummyData');
    setUser(dummyUserProfile);
  }, []);
  // Accept user and collectionPoint from navigation params if provided
  const collectionPoint = route?.params?.collectionPoint || null;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(user.referralCode);
    Alert.alert("Copied!", "Referral code copied to clipboard.");
  };

  const handleShare = async () => {
    let message = `Join me on Green IQ! Use my referral code: ${
      user ? user.referralCode : "Loading..."
    } to get bonus points!`;
    if (collectionPoint && collectionPoint.name) {
      message = `Join me at ${
        collectionPoint.name
      } on Green IQ! Use my referral code: ${
        user ? user.referralCode : "Loading..."
      } to get bonus points and connect at this collection point!`;
    }
    try {
      await Share.share({ message });
    } catch (error) {
      Alert.alert("Error", "Could not share referral code.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fffe" }}>
      {/* Top bar with back arrow */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 44,
          paddingBottom: 16,
          backgroundColor: "#1B5E20",
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
          style={{ padding: 6, marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            Invite Friends
          </Text>
        </View>
      </View>
      {/* User Info */}
      <View style={styles.userCard}>
        <Image
          source={
            user
              ? {
                  uri: user.profileImage || 'https://via.placeholder.com/150',
                }
              : require("../assets/logo.png")
          }
          style={styles.avatar}
        />
        <View style={{ marginLeft: 14 }}>
          <Text style={styles.userName}>
            {user ? user.name : "Loading..."}
          </Text>
          <Text style={styles.userEmail}>
            {user ? user.email : "Loading..."}
          </Text>
          <View
            style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
          >
            <Ionicons
              name="leaf"
              size={18}
              color="#00C896"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.ecoPoints}>
              {user ? user.ecoPoints : "Loading..."} Eco Points
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons
            name="people-outline"
            size={32}
            color="#1B5E20"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.title}>Invite Friends</Text>
        </View>
        <Text style={styles.desc}>
          Get 100 points for each friend you invite and creates an account. Use
          your referral code to invite your friend.
        </Text>
        <View style={styles.codeRow}>
          <Text style={styles.code}>
            {user ? user.referralCode : "Loading..."}
          </Text>
          <TouchableOpacity onPress={handleCopy} style={styles.copyButton}>
            <Ionicons name="copy-outline" size={20} color="#00C896" />
            <Text style={styles.copyText}>Copy</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons
            name="share-social-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.shareText}>Share link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    margin: 18,
    marginBottom: 0,
    elevation: 2,
    shadowColor: "#1B5E20",
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  userEmail: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  ecoPoints: {
    fontSize: 15,
    color: "#00C896",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,
    margin: 18,
    elevation: 3,
    shadowColor: "#1B5E20",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  desc: {
    fontSize: 15,
    color: "#555",
    marginBottom: 18,
    textAlign: "center",
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  code: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00C896",
    letterSpacing: 2,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginRight: 10,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  copyText: {
    color: "#00C896",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 15,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7c3aed",
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 36,
    marginTop: 8,
  },
  shareText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
