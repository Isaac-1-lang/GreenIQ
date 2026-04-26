import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Animated as RNAnimated,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import BinBuddy from '../components/BinBuddy';
import CommunityPulse from '../components/CommunityPulse';

const { width, height } = Dimensions.get("window");

const ecoTips = [
  { 
    text: '🌟 Did you know? Recycling one aluminum can saves enough energy to run a TV for 3 hours!',
    likes: 124,
    liked: false
  },
  { 
    text: '💡 Tip: Rinse containers before recycling to avoid contamination.',
    likes: 89,
    liked: false
  },
  { 
    text: '♻️ Fact: Glass can be recycled endlessly without loss in quality.',
    likes: 156,
    liked: false
  },
  { 
    text: '🛍️ Tip: Bring your own bag to reduce plastic waste.',
    likes: 72,
    liked: false
  },
  { 
    text: '🌱 Fact: Composting food scraps reduces landfill waste and creates rich soil.',
    likes: 203,
    liked: false
  }
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [ecoTipIndex, setEcoTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState(ecoTips);
  const [isOffline, setIsOffline] = useState(false);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  
  const scanAnim = useRef(new RNAnimated.Value(0.8)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const tipFadeAnim = useRef(new RNAnimated.Value(1)).current;
  const quickActionsAnim = useRef(new RNAnimated.Value(0)).current;
  
  const window = useWindowDimensions();
  const isTablet = window.width >= 700;
  const isSmallDevice = window.width < 350;

  useEffect(() => {
    // Using dummy user data
    const { dummyUserProfile } = require('../utils/dummyData');
    setUser(dummyUserProfile);
    setIsLoading(false);
    RNAnimated.parallel([
      RNAnimated.spring(scanAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const createPulse = () => {
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => createPulse());
    };
    createPulse();

    const interval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(tipFadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.timing(tipFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setEcoTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Using dummy data - simulating refresh
    const { dummyUserProfile } = require('../utils/dummyData');
    setUser(dummyUserProfile);
    setIsOffline(false);
    setRefreshing(false);
  };

  const handleLikeTip = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedTips = [...tips];
    updatedTips[index] = {
      ...updatedTips[index],
      liked: !updatedTips[index].liked,
      likes: updatedTips[index].liked 
        ? updatedTips[index].likes - 1 
        : updatedTips[index].likes + 1
    };
    setTips(updatedTips);
  };

  const toggleQuickActions = () => {
    if (quickActionsVisible) {
      RNAnimated.timing(quickActionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => setQuickActionsVisible(false));
    } else {
      setQuickActionsVisible(true);
      RNAnimated.timing(quickActionsAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  };

  const defaultStats = [
    {
      icon: "leaf-outline",
      value: user?.itemsRecycled || "0",
      label: "Items Recycled",
      color: "#00C896",
      gradient: ["#00C896", "#00A578"],
    },
    {
      icon: "trophy-outline",
      value: user?.ecoPoints || "0",
      label: "Eco Points",
      color: "#FF6B35",
      gradient: ["#FF6B35", "#F7931E"],
    },
    {
      icon: "people-outline",
      value: user?.communityRank || "#238",
      label: "Community Rank",
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#44A08D"],
    },
  ];
  const stats = defaultStats;

  const badges = [
    { id: 1, name: 'Starter', icon: 'star', earned: true, color: '#FFD700' },
    { id: 2, name: 'Recycler', icon: 'leaf', earned: true, color: '#00C896' },
    { id: 3, name: 'Eco Hero', icon: 'trophy', earned: user?.ecoPoints > 500, color: '#FF6B35' },
    { id: 4, name: 'Streak', icon: 'flame', earned: user?.streakDays > 7, color: '#FF5722' },
  ];

  const leaderboard = [
    { id: 1, name: 'EcoWarrior John', points: 15430, avatar: null },
    { id: 2, name: 'Green Sarah', points: 12890, avatar: null },
    { id: 3, name: 'RecyclePro Mike', points: 11250, avatar: null },
  ];

  const progress = user?.ecoPoints ? Math.min(user.ecoPoints / 1000, 1) : 0.1;

  const quickActions = [
    { icon: "scan-outline", label: "Scan", action: () => navigation.navigate("ScanChoice") },
    { icon: "map-outline", label: "Map", action: () => navigation.navigate("Map") },
    { icon: "qr-code-outline", label: "Redeem", action: () => navigation.navigate("Rewards") },
    { icon: "settings-outline", label: "Settings", action: () => navigation.navigate("Settings") },
  ];

  const compactSectionSpacing = [styles.sectionSpacing, isTablet ? { marginTop: 18, marginBottom: 18, paddingHorizontal: 28, maxWidth: 800 } : { marginTop: 18, marginBottom: 18, paddingHorizontal: 12, maxWidth: '95%' }];

  const compactSectionHeader = [styles.sectionHeader, { marginBottom: 10 }];
  const compactSectionTitle = [styles.sectionTitle, { fontSize: 16 }];
  const compactSeeAllText = [styles.seeAllText, { fontSize: 13 }];

  const compactStatCard = [styles.statCard, isTablet ? { width: '30%', minWidth: 120, maxWidth: 220, padding: 12, borderRadius: 14, marginBottom: 14 } : { width: '47%', minWidth: 100, maxWidth: 180, padding: 10, borderRadius: 12, marginBottom: 12 }];
  const compactStatValue = [styles.statValue, { fontSize: 18 }];
  const compactStatLabel = [styles.statLabel, { fontSize: 11 }];

  const compactProgressCard = [styles.progressCard, isTablet ? { marginBottom: 18, maxWidth: 800, borderRadius: 14, padding: 12 } : { marginBottom: 14, maxWidth: '95%', borderRadius: 12, padding: 8 }];

  const compactBadgeCircle = (badge) => [
    styles.badgeCircle,
    {
      width: 90,
      height: 110,
      borderRadius: 24,
      marginHorizontal: 28,
      backgroundColor: 'transparent',
      shadowColor: 'transparent',
      borderWidth: 2,
      borderColor: badge.earned ? badge.color : '#e0e0e0',
    },
  ];
  const compactBadgeLabel = [styles.badgeLabel, { fontSize: 14 }];

  const leaderboardPreview = leaderboard.slice(0, 2);

  const compactQuickLinksRow = [styles.quickLinksRow, isTablet ? { gap: 18, marginBottom: 18, maxWidth: 800 } : { gap: 10, marginBottom: 14, maxWidth: '95%' }];
  const compactQuickLinkIconWrap = [styles.quickLinkIconWrap, isTablet ? { padding: 12 } : { padding: 8 }];
  const compactQuickLinkLabel = [styles.quickLinkLabel, { fontSize: 11 }];

  const compactDailyChallengeCard = [styles.dailyChallengeCard, isTablet ? { marginBottom: 18, maxWidth: 800, borderRadius: 14 } : { marginBottom: 14, maxWidth: '95%', borderRadius: 12 }];
  const compactDailyChallengeGradient = [styles.dailyChallengeGradient, isTablet ? { padding: 18, borderRadius: 14 } : { padding: 10, borderRadius: 12 }];
  const compactDailyChallengeTitle = [styles.dailyChallengeTitle, { fontSize: 14 }];
  const compactDailyChallengeText = [styles.dailyChallengeText, { fontSize: 11 }];

  const featuredRewards = [
    {
      id: 1,
      name: 'Eco Certificate',
      cost: 500,
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    {
      id: 2,
      name: 'Reusable Water Bottle',
      cost: 800,
      image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
    },
    {
      id: 3,
      name: 'Discount Coupon',
      cost: 300,
      image: 'https://cdn-icons-png.flaticon.com/512/3523/3523887.png',
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={styles.loadingText}>Loading your eco profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.simpleTopNav}>
        <View style={styles.simpleTopNavLeft}>
          <Text style={styles.simpleTopNavGreeting}>Welcome back,</Text>
          <Text style={styles.simpleTopNavUserName} numberOfLines={1} adjustsFontSizeToFit>
            {user ? user.name : "Guest User"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(user ? "Profile" : "Login")}
          style={styles.simpleTopNavAvatarTouchable}
          accessibilityLabel={user ? "Go to profile" : "Login"}
        >
          <View style={styles.simpleTopNavAvatarWrap}>
            {user && user.profileImage ? (
              <Image
                source={{ uri: user.profileImage || 'https://via.placeholder.com/150' }}
                style={styles.simpleTopNavAvatar}
              />
            ) : (
              <Ionicons name="person" size={28} color="#FF3D57" style={{ backgroundColor: '#bbb', borderRadius: 16, padding: 8 }} />
            )}
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1B5E20", "#2E7D32"]}
            tintColor="#1B5E20"
          />
        }
      >
        <TouchableOpacity style={compactDailyChallengeCard} onPress={() => navigation.navigate('Challenges')} activeOpacity={0.9}>
          <LinearGradient colors={["#fffbe6", "#e0f7fa"]} style={compactDailyChallengeGradient}>
            <View style={styles.dailyChallengeContent}>
              <Ionicons name="flash" size={isTablet ? 24 : 18} color="#FF6B35" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={compactDailyChallengeTitle}>Daily Challenge</Text>
                <Text style={compactDailyChallengeText}>Recycle 5 plastic bottles today and earn bonus points!</Text>
              </View>
              <Ionicons name="chevron-forward" size={isTablet ? 20 : 16} color="#FF6B35" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Bin Buddy - Emotional UI */}
        <TouchableOpacity onPress={() => navigation.navigate('Quiz')} activeOpacity={0.9}>
          <BinBuddy fillPercentage={45} />
        </TouchableOpacity>

        {/* Community Pulse - Live Feed */}
        <CommunityPulse />

        <View style={compactQuickLinksRow}>
          {[{ icon: 'scan-outline', label: 'Scan', nav: 'ScanChoice' }, { icon: 'medal-outline', label: 'Badges', nav: 'Achievements' }, { icon: 'analytics-outline', label: 'Stats', nav: 'EcoPointsDetails' }, { icon: 'chatbubbles-outline', label: 'Community', nav: 'Chat' }].map((item, idx) => (
            <TouchableOpacity key={item.label} style={styles.quickLinkButton} onPress={() => navigation.navigate(item.nav)} activeOpacity={0.85}>
              <View style={compactQuickLinkIconWrap}>
                <Ionicons name={item.icon} size={isTablet ? 20 : 16} color="#FF3D57" />
              </View>
              <Text style={compactQuickLinkLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <RNAnimated.View style={compactSectionSpacing}>
          <View style={compactSectionHeader}>
            <Text style={compactSectionTitle}>📊 My Eco-Impact</Text>
            <TouchableOpacity onPress={() => navigation.navigate('EcoPointsDetails')}>
              <Text style={compactSeeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.statsGrid, isTablet ? { gap: 18, justifyContent: 'flex-start' } : {}]}>
            {stats.map((stat, index) => (
              <TouchableOpacity key={index} style={compactStatCard} activeOpacity={0.9} accessibilityLabel={stat.label} onPress={() => {
                if (stat.label === 'Eco Points') navigation.navigate('EcoPointsDetails');
                else if (stat.label === 'Items Recycled') navigation.navigate('Leaderboard');
                else if (stat.label === 'Community Rank') navigation.navigate('Leaderboard');
                else if (stat.label === 'Streak Days') navigation.navigate('Achievements');
              }}>
                <LinearGradient colors={["#fff", "#fafafa"]} style={styles.statCardGradient}>
                  <LinearGradient colors={stat.gradient} style={[styles.statIconContainer, isTablet ? styles.statIconContainerTablet : {}]}>
                    <Ionicons name={stat.icon} size={isTablet ? 18 : 14} color="#fff" />
                  </LinearGradient>
                  <Text style={compactStatValue}>{stat.value}</Text>
                  <Text style={compactStatLabel}>{stat.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </RNAnimated.View>
        <RNAnimated.View style={compactProgressCard}>
          <TouchableOpacity onPress={() => navigation.navigate('Achievements')} activeOpacity={0.85}>
            <LinearGradient colors={["#E8F5E9", "#C8E6C9"]} style={styles.progressCardGradient}>
              <View style={styles.progressHeader}>
                <LinearGradient colors={["#00E676", "#00C853"]} style={styles.progressIconContainer}>
                  <Ionicons name="trending-up" size={isTablet ? 14 : 10} color="#fff" />
                </LinearGradient>
                <Text style={[styles.progressTitle, { fontSize: 13 }]}>Progress to Next Badge</Text>
              </View>
              <View style={styles.progressBarBg}>
                <LinearGradient colors={["#00E676", "#00C853"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[styles.progressBarFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
              <Text style={[styles.progressText, { fontSize: 11, color: '#1B5E20' }]}>🏆 {Math.round(progress * 100)}% to "Eco Hero" badge</Text>
            </LinearGradient>
          </TouchableOpacity>
        </RNAnimated.View>
        <View style={compactSectionSpacing}>
          <View style={compactSectionHeader}>
            <Text style={compactSectionTitle}>🏅 Achievements</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Achievements')}>
              <Text style={compactSeeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgesScrollContent}>
            {badges.map((badge, index) => (
              <TouchableOpacity key={badge.id} onPress={() => navigation.navigate('Achievements')} activeOpacity={0.8}>
                <RNAnimated.View style={compactBadgeCircle(badge)}>
                  <Ionicons name={badge.icon} size={48} color={badge.earned ? (badge.color === '#00C896' ? '#FF6B35' : badge.color) : '#bbb'} style={{ marginBottom: 8 }} />
                  <Text style={compactBadgeLabel}>{badge.name}</Text>
                </RNAnimated.View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={compactSectionSpacing}>
          <View style={compactSectionHeader}>
            <Text style={compactSectionTitle}>🏆 Top Recyclers</Text>
            <Text style={compactSeeAllText}>See All</Text>
          </View>
          <LinearGradient colors={["#fff", "#fff8e1"]} style={styles.leaderboardGradient}>
            {leaderboardPreview.map((user, idx) => (
              <TouchableOpacity key={user.id} onPress={() => navigation.navigate('Leaderboard')} activeOpacity={0.8}>
                <View style={[styles.leaderboardRow, { paddingVertical: 6, paddingHorizontal: 8 }] }>
                  <View style={styles.leaderboardPosition}>
                    <Ionicons name="trophy" size={isTablet ? 14 : 10} color={idx === 0 ? '#FFD700' : idx === 1 ? '#FF3D57' : '#FF6B35'} />
                    <Text style={[styles.leaderboardRank, { fontSize: 10 } ]}>#{idx + 1}</Text>
                  </View>
                  <Text style={[styles.leaderboardName, { fontSize: 11 }]} numberOfLines={1}>{user.name}</Text>
                  <View style={styles.leaderboardPointsContainer}>
                    <Text style={[styles.leaderboardPoints, { fontSize: 11 }]}>{user.points.toLocaleString()}</Text>
                    <Text style={[styles.leaderboardPointsLabel, { fontSize: 9 }]}>pts</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>
        <View style={compactSectionSpacing}>
          <View style={compactSectionHeader}>
            <Text style={compactSectionTitle}>🎁 EcoPoints Rewards & Marketplace</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
              <Text style={compactSeeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 6 }}>
            {featuredRewards.map((reward) => (
              <View key={reward.id} style={{ backgroundColor: '#e0f7fa', borderRadius: 16, padding: 14, marginRight: 16, alignItems: 'center', width: 140, elevation: 2 }}>
                <Image source={{ uri: reward.image }} style={{ width: 48, height: 48, borderRadius: 10, marginBottom: 8, backgroundColor: '#fff' }} />
                <Text style={{ fontWeight: 'bold', color: '#1B5E20', fontSize: 15, marginBottom: 2, textAlign: 'center' }}>{reward.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Ionicons name="leaf" size={16} color="#FF3D57" />
                  <Text style={{ color: '#00C896', fontWeight: 'bold', fontSize: 13, marginLeft: 4 }}>{reward.cost}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View> 
        <View style={compactSectionSpacing}>
          <View style={compactSectionHeader}>
            <Text style={compactSectionTitle}>🌟 Discover</Text>
            <View style={styles.sectionTitleUnderline} />
          </View>
          <View style={[styles.discoverGrid, isTablet ? { gap: 14 } : { gap: 8 }] }>
            {[
              { icon: "map-outline", text: "Find Drop-off", gradient: ["#4ECDC4", "#44A08D"], onPress: () => navigation.navigate("Map") },
              { icon: "shield-outline", text: "Safe Zones", gradient: ["#FF3D57", "#FFD700"], onPress: () => navigation.navigate("SafeZonesMap") },
              { icon: "newspaper-outline", text: "Recycling Tips", gradient: ["#FF6B35", "#F7931E"], onPress: () => navigation.navigate("Tips") },
              { icon: "medal-outline", text: "Achievements", gradient: ["#9C27B0", "#673AB7"], onPress: () => navigation.navigate("Achievements") },
              { icon: "chatbubbles-outline", text: "Community", gradient: ["#FF5722", "#FF8A65"], onPress: () => navigation.navigate("Community") }
            ].map((item, index) => (
              <TouchableOpacity key={index} style={[styles.discoverCard, isTablet ? { width: '22%' } : { width: '47%' }]} onPress={item.onPress} activeOpacity={0.9} accessibilityLabel={item.text}>
                <LinearGradient colors={["#fff", "#fafafa"]} style={styles.discoverCardGradient}>
                  <LinearGradient colors={item.gradient} style={styles.discoverIconContainer}>
                    <Ionicons name={item.icon} size={isTablet ? 16 : 12} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.discoverText, isTablet ? { fontSize: 12 } : { fontSize: 10 }]}>{item.text}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {quickActionsVisible && (
        <RNAnimated.View 
          style={[
            styles.quickActionsOverlay,
            { opacity: quickActionsAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.quickActionsBackground}
            onPress={toggleQuickActions}
            activeOpacity={1}
          />
        </RNAnimated.View>
      )}
      
      <RNAnimated.View 
        style={[
          styles.quickActionsContainer,
          { 
            transform: [{
              translateY: quickActionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0]
              })
            }],
            opacity: quickActionsAnim
          }
        ]}
      >
        {quickActionsVisible && (
          <>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionButton}
                onPress={() => {
                  toggleQuickActions();
                  action.action();
                }}
                activeOpacity={0.8}
              >
                <View style={styles.quickActionIcon}>
                  <Ionicons name={action.icon} size={24} color="#FF3D57" />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </RNAnimated.View>
        
      <TouchableOpacity 
        style={styles.fab}
        onPress={toggleQuickActions}
        activeOpacity={0.9}
        accessibilityLabel="Quick actions"
      >
        <Ionicons 
          name={quickActionsVisible ? "close" : "menu"} 
          size={28} 
          color="#FF3D57" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fffe",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#1B5E20',
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  sectionSpacing: {
    marginTop: 24,
    marginBottom: 24,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  headerWrap: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 25,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 8,
    shadowColor: "#1B5E20",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  headerLeft: {
    flex: 1,
    marginRight: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offlineIndicator: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 4,
    fontWeight: '500',
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 2,
  },
  motivationText: {
    fontSize: 15,
    color: "#E8F5E8",
    marginTop: 2,
    fontWeight: '600',
  },
  avatarTouchable: {
    borderRadius: 32,
    padding: 2,
  },
  avatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    elevation: 6,
    shadowColor: "#00E676",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f0f0f0',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecoTipBanner: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 18,
    elevation: 4,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  ecoTipGradient: {
    borderRadius: 18,
    padding: 16,
  },
  ecoTipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoTipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ecoTipText: {
    color: '#1B5E20',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    lineHeight: 20,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    padding: 6,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  primaryActionCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    elevation: 12,
    shadowColor: "#00C853",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  primaryActionGradient: {
    borderRadius: 24,
    padding: 28,
  },
  primaryActionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 6,
  },
  primaryActionSubtitle: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 8,
    lineHeight: 20,
  },
  actionBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  actionBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  primaryActionIcon: {
    marginLeft: 20,
  },
  scanIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 16,
    elevation: 4,
    shadowColor: '#1B5E20',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  section: {
    marginTop: 32,
    marginBottom: 16,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1B5E20",
    marginBottom: 6,
  },
  sectionTitleUnderline: {
    width: 40,
    height: 3,
    backgroundColor: '#00E676',
    borderRadius: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    borderRadius: 20,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statCardTablet: {
    width: '23%',
    marginBottom: 24,
  },
  statCardGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  statIconContainerTablet: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 4,
  },
  statValueTablet: {
    fontSize: 32,
  },
  statLabel: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  statLabelTablet: {
    fontSize: 16,
  },
  progressCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    backgroundColor: 'transparent',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  progressCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  progressTitle: {
    fontWeight: '700',
    color: '#1B5E20',
    fontSize: 16,
  },
  progressBarBg: {
    width: '100%',
    height: 12,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 12,
    borderRadius: 8,
  },
  progressText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  badgesContainer: {
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 20,
    maxWidth: 900,
    alignSelf: 'center',
  },
  badgesSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'left',
    paddingLeft: 4,
  },
  badgesScrollContent: {
    paddingHorizontal: 16,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 20,
  },
  badgeCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 100,
    borderRadius: 16,
    marginHorizontal: 8,
    backgroundColor: '#e0f7fa',
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  badgeLocked: {
    backgroundColor: '#f0f0f0',
  },
  badgeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },
  leaderboardPreview: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#43e97b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  leaderboardGradient: {
    borderRadius: 16,
    padding: 8,
  },
  leaderboardSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B5E20',
    marginBottom: 10,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
  },
  leaderboardPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 40,
    justifyContent: 'center',
  },
  leaderboardRank: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    marginLeft: 4,
  },
  leaderboardName: {
    flex: 1,
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
    marginRight: 8,
  },
  leaderboardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginLeft: 8,
  },
  leaderboardPoints: {
    color: '#11998e',
    fontWeight: 'bold',
    fontSize: 15,
  },
  leaderboardPointsLabel: {
    color: '#888',
    fontSize: 12,
    marginLeft: 2,
    fontWeight: '600',
  },
  discoverCardGradient: {
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  discoverIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  discoverText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  discoverTextTablet: {
    fontSize: 16,
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  discoverGridTablet: {
    gap: 24,
  },
  discoverCard: {
    width: '47%',
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  discoverCardTablet: {
    width: '23%',
  },
  bottomSpacing: {
    height: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 10,
  },
  quickActionsContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    zIndex: 9,
  },
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 8,
  },
  quickActionsBackground: {
    flex: 1,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  quickActionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1B5E20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  quickActionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  simpleTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    minHeight: 72,
  },
  simpleTopNavLeft: {
    flex: 1,
    justifyContent: 'center',
  },
  simpleTopNavGreeting: {
    fontSize: 14,
    color: '#888',
    fontWeight: '500',
  },
  simpleTopNavUserName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#222',
    marginTop: 2,
  },
  simpleTopNavAvatarTouchable: {
    borderRadius: 20,
    padding: 2,
  },
  simpleTopNavAvatarWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  simpleTopNavAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bbb',
  },
  seeAllText: {
    color: '#00C896',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  // New styles for Daily Challenge and Quick Links
  dailyChallengeCard: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    marginBottom: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  dailyChallengeGradient: {
    borderRadius: 20,
    padding: 20,
  },
  dailyChallengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyChallengeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
    marginBottom: 2,
  },
  dailyChallengeText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
  },
  quickLinkButton: {
    alignItems: 'center',
    flex: 1,
  },
  quickLinkIconWrap: {
    backgroundColor: '#E8F5E8',
    borderRadius: 18,
    padding: 12,
    marginBottom: 8,
  },
  quickLinkLabel: {
    fontSize: 13,
    color: '#1B5E20',
    fontWeight: '700',
  },
});

export default HomeScreen;