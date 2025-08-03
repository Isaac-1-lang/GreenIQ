import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

export default function Leaderboard({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 700;
  const [allUsers, setAllUsers] = useState(null);

  useEffect(() => {
    const leaderBoard = async () => {
      try {
        const response = await axios.get(
          "https://trash2treasure-backend.onrender.com/leaderboard"
        );
        setAllUsers(response.data.leaderBoard);
      } catch (error) {
        console.log(error)
        console.log(error?.response)
        console.log(data?.message)
        setTimeout(() => {
          Alert.alert(error?.response?.data?.message);
        }, 100);
      }
    };

    leaderBoard()
  }, []);

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
            🏆 Leaderboard
          </Text>
        </View>
      </View>
      {allUsers ? (
         <ScrollView
        contentContainerStyle={{
          paddingHorizontal: isTablet ? 60 : 12,
          paddingBottom: 40,
        }}
      >
        {allUsers.map((user, idx) => (
          <LinearGradient
            key={user._id}
            colors={[idx < 3 ? medalColors[idx] + "22" : "#fff", "#f8fffe"]}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 18,
              padding: isTablet ? 22 : 12,
              marginBottom: isTablet ? 24 : 14,
              elevation: 2,
              shadowColor: idx < 3 ? medalColors[idx] : "#4ECDC4",
              shadowOpacity: 0.1,
              shadowRadius: 8,
              backgroundColor: "#fff",
            }}
          >
            {/* Rank/Medal */}
            <View style={{ alignItems: "center", marginRight: 16, width: 40 }}>
              <View
                style={{
                  backgroundColor: idx < 3 ? medalColors[idx] : "#e0e0e0",
                  borderRadius: 16,
                  width: 32,
                  height: 32,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                {idx < 3 ? (
                  <Ionicons name="medal-outline" size={22} color="#fff" />
                ) : (
                  <Text
                    style={{ color: "#888", fontWeight: "bold", fontSize: 16 }}
                  >
                    {idx + 1}
                  </Text>
                )}
              </View>
              {idx < 3 && (
                <Text
                  style={{
                    color: medalColors[idx],
                    fontWeight: "bold",
                    fontSize: 12,
                  }}
                >
                  {["1st", "2nd", "3rd"][idx]}
                </Text>
              )}
            </View>
            {/* Avatar */}
            <Image
              source={{ uri: `https://trash2treasure-backend.onrender.com/${user.profilePic}` }}
              style={{
                width: 54,
                height: 54,
                borderRadius: 27,
                marginRight: 16,
                borderWidth: 2,
                borderColor: idx < 3 ? medalColors[idx] : "#4ECDC4",
              }}
            />
            {/* Name and Points */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: isTablet ? 20 : 16,
                  fontWeight: "bold",
                  color: "#1B5E20",
                }}
              >
                {user.fullNames}
              </Text>
              <Text
                style={{
                  fontSize: isTablet ? 15 : 12,
                  color: "#888",
                  marginTop: 2,
                }}
              >
                {user.points} pts
              </Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
      ): (<View><Text>Loading...</Text></View>)}
    </View>
  );
}
