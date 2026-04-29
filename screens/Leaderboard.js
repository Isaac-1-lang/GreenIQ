import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const medalColors = ["#FBBF24", "#94A3B8", "#B45309"]; // Gold, Silver, Bronze
const locs = ["All Rwanda", "Gasabo", "Nyarugenge", "Kicukiro"];

export default function Leaderboard({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 700;
  
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState("All Rwanda");
  
  // Pagination
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    // Simulate API fetch delay
    setTimeout(() => {
      const { dummyLeaderboard } = require('../utils/dummyData');
      
      // Inject dummy locations if not present
      const populatedUsers = dummyLeaderboard.leaderBoard.map((u, i) => ({
        ...u,
        location: u.location || ["Gasabo", "Nyarugenge", "Kicukiro"][i % 3]
      }));
      
      // Generate some extra dummy data to demonstrate pagination
      const extendedUsers = [...populatedUsers];
      if (populatedUsers.length < 20) {
        for(let i = populatedUsers.length; i < 35; i++) {
          extendedUsers.push({
            _id: `generated_${i}`,
            name: `Eco Hero ${i}`,
            ecoPoints: Math.floor(Math.random() * 500) + 50,
            location: ["Gasabo", "Nyarugenge", "Kicukiro"][i % 3],
            profileImage: 'https://via.placeholder.com/150'
          });
        }
      }
      
      const sortedUsers = extendedUsers.sort((a,b) => b.ecoPoints - a.ecoPoints);
      
      setAllUsers(sortedUsers);
      setLoading(false);
    }, 800);
  }, []);

  const filteredUsers = useMemo(() => {
    if (selectedLocation === "All Rwanda") return allUsers;
    return allUsers.filter(u => u.location === selectedLocation);
  }, [allUsers, selectedLocation]);

  const displayedUsers = useMemo(() => {
    return filteredUsers.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  const hasMore = displayedUsers.length < filteredUsers.length;

  const loadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoadingMore(false);
    }, 600);
  };

  const handleLocationChange = (loc) => {
    setSelectedLocation(loc);
    setPage(1); // Reset pagination
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Premium Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Leaderboard</Text>
            <Text style={styles.headerSubtitle}>Top Recyclers</Text>
          </View>
          <View style={{width: 40}} /> 
        </View>

        {/* Location Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {locs.map((loc) => (
              <TouchableOpacity
                key={loc}
                onPress={() => handleLocationChange(loc)}
                style={[styles.filterChip, selectedLocation === loc && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, selectedLocation === loc && styles.filterTextActive]}>
                  {loc}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching rankings...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.listContainer,
            isTablet && styles.listContainerTablet,
          ]}
          showsVerticalScrollIndicator={false}
        >
          {displayedUsers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="leaf-outline" size={48} color={COLORS.textMuted} />
              <Text style={styles.emptyText}>No users found in {selectedLocation}</Text>
            </View>
          ) : (
            displayedUsers.map((user, idx) => {
              const isTop3 = idx < 3;
              const bgColor = isTop3 ? "#FFFBEB" : COLORS.surface; // Subtle highlight for top 3
              
              return (
                <View
                  key={user._id}
                  style={[
                    styles.userCard,
                    isTablet && styles.userCardTablet,
                    { backgroundColor: bgColor }
                  ]}
                >
                  {/* Rank/Medal */}
                  <View style={styles.rankContainer}>
                    <View
                      style={[
                        styles.rankBadge,
                        { backgroundColor: isTop3 ? medalColors[idx] : '#F1F5F9' }
                      ]}
                    >
                      {isTop3 ? (
                        <Ionicons name="medal" size={16} color={COLORS.surface} />
                      ) : (
                        <Text style={styles.rankText}>{idx + 1}</Text>
                      )}
                    </View>
                  </View>

                  {/* Avatar */}
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }}
                      style={[
                        styles.avatar,
                        { borderColor: isTop3 ? medalColors[idx] : '#E2E8F0' }
                      ]}
                    />
                  </View>

                  {/* Name and Points */}
                  <View style={styles.userInfo}>
                    <Text style={[styles.userName, isTablet && styles.userNameTablet]} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <Text style={[styles.userLocation, isTablet && styles.userLocationTablet]}>
                      <Ionicons name="location" size={10} color={COLORS.textMuted} /> {user.location}
                    </Text>
                  </View>
                  
                  <View style={styles.pointsContainer}>
                    <Text style={[styles.pointsText, isTablet && styles.pointsTextTablet]}>
                      {user.ecoPoints.toLocaleString()}
                    </Text>
                    <Text style={styles.pointsLabel}>pts</Text>
                  </View>
                </View>
              );
            })
          )}

          {hasMore && displayedUsers.length > 0 && (
            <TouchableOpacity 
              style={styles.loadMoreButton} 
              onPress={loadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color={COLORS.surface} />
              ) : (
                <Text style={styles.loadMoreText}>Load More</Text>
              )}
            </TouchableOpacity>
          )}
          
          <View style={{height: 20}} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    borderBottomLeftRadius: SIZES.radiusXl,
    borderBottomRightRadius: SIZES.radiusXl,
    paddingTop: 50,
    ...SHADOWS.medium,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SIZES.m,
    marginBottom: SIZES.m,
  },
  backButton: {
    padding: SIZES.xs,
    width: 40,
  },
  titleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: SIZES.h2,
    fontWeight: "800",
  },
  headerSubtitle: {
    color: COLORS.primaryLight,
    fontSize: SIZES.body2,
    fontWeight: "600",
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterContainer: {
    paddingBottom: SIZES.m,
  },
  filterScroll: {
    paddingHorizontal: SIZES.m,
    gap: SIZES.s,
  },
  filterChip: {
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    borderRadius: SIZES.radiusPill,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: SIZES.xs,
  },
  filterChipActive: {
    backgroundColor: COLORS.surface,
    ...SHADOWS.small,
  },
  filterText: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    fontSize: SIZES.body2,
  },
  filterTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.m,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: SIZES.m,
    paddingTop: SIZES.l,
    paddingBottom: SIZES.xxl,
  },
  listContainerTablet: {
    paddingHorizontal: '15%',
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  userCardTablet: {
    padding: SIZES.l,
    marginBottom: SIZES.l,
  },
  rankContainer: {
    width: 40,
    alignItems: 'center',
    marginRight: SIZES.s,
  },
  rankBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rankText: {
    color: COLORS.textSecondary,
    fontWeight: "800",
    fontSize: SIZES.body2,
  },
  avatarContainer: {
    marginRight: SIZES.m,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    fontSize: SIZES.body1,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 2,
  },
  userNameTablet: {
    fontSize: SIZES.h4,
  },
  userLocation: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userLocationTablet: {
    fontSize: SIZES.body2,
  },
  pointsContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pointsText: {
    fontSize: SIZES.h4,
    fontWeight: "800",
    color: COLORS.primaryDark,
  },
  pointsTextTablet: {
    fontSize: SIZES.h3,
  },
  pointsLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: SIZES.m,
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.m,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    marginVertical: SIZES.m,
    ...SHADOWS.small,
  },
  loadMoreText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: SIZES.body1,
  }
});
