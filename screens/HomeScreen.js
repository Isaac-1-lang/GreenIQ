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
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

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
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  
  const scanAnim = useRef(new RNAnimated.Value(0.8)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  const quickActionsAnim = useRef(new RNAnimated.Value(0)).current;
  
  const window = useWindowDimensions();
  const isTablet = window.width >= 700;

  useEffect(() => {
    // Simulator dummy data
    setTimeout(() => {
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
          duration: 800,
          useNativeDriver: true,
        }),
        RNAnimated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      const { dummyUserProfile } = require('../utils/dummyData');
      setUser(dummyUserProfile);
      setRefreshing(false);
    }, 1000);
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
      icon: "leaf",
      value: user?.itemsRecycled || "0",
      label: "Items",
      color: COLORS.primaryDark,
      bgColor: '#D1FAE5', // Green pastel
    },
    {
      icon: "trophy",
      value: user?.ecoPoints || "0",
      label: "Points",
      color: "#D97706",
      bgColor: '#FEF3C7', // Amber pastel
    },
    {
      icon: "people",
      value: user?.communityRank || "#238",
      label: "Rank",
      color: "#2563EB",
      bgColor: '#DBEAFE', // Blue pastel
    },
  ];

  const badges = [
    { id: 1, name: 'Starter', icon: 'star', earned: true, color: '#FBBF24' },
    { id: 2, name: 'Recycler', icon: 'leaf', earned: true, color: COLORS.success },
    { id: 3, name: 'Eco Hero', icon: 'trophy', earned: user?.ecoPoints > 500, color: COLORS.accent },
    { id: 4, name: 'Streak', icon: 'flame', earned: user?.streakDays > 7, color: '#EF4444' },
  ];

  const leaderboardPreview = [
    { id: 1, name: 'EcoWarrior John', points: 15430 },
    { id: 2, name: 'Green Sarah', points: 12890 },
  ];

  const progress = user?.ecoPoints ? Math.min(user.ecoPoints / 1000, 1) : 0.1;

  const quickActions = [
    { icon: "scan", label: "Scan AI", action: () => navigation.navigate("ScanChoice") },
    { icon: "map", label: "Map", action: () => navigation.navigate("Map") },
    { icon: "gift", label: "Redeem", action: () => navigation.navigate("Rewards") },
    { icon: "cog", label: "Settings", action: () => navigation.navigate("Settings") },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading eco-profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerGreeting}>Welcome back,</Text>
          <Text style={styles.headerUserName} numberOfLines={1}>
            {user ? user.name : "Guest User"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(user ? "Profile" : "Login")}
          style={styles.avatarTouchable}
        >
          {user && user.profileImage ? (
            <Image
              source={{ uri: user.profileImage }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={COLORS.primaryDark} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <RNAnimated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* Daily Challenge Premium Card */}
          <TouchableOpacity 
            style={styles.challengeCard} 
            onPress={() => navigation.navigate('Challenges')} 
            activeOpacity={0.9}
          >
            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.challengeGradient}>
              <View style={styles.challengeIconBg}>
                <Ionicons name="flash" size={20} color={COLORS.success} />
              </View>
              <View style={styles.challengeTextWrapper}>
                <Text style={styles.challengeTitle}>Daily Challenge</Text>
                <Text style={styles.challengeSubtitle}>Recycle 5 plastic bottles today!</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.success} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Emotional UI */}
          <View style={styles.sectionSpacer}>
            <TouchableOpacity onPress={() => navigation.navigate('Quiz')} activeOpacity={0.9}>
              <BinBuddy fillPercentage={45} />
            </TouchableOpacity>
          </View>

          {/* Quick Links Row */}
          <View style={styles.quickLinksRow}>
            {[
              { icon: 'scan', label: 'Scanner', nav: 'ScanChoice', color: COLORS.primaryDark, bg: '#ccfbf1' }, 
              { icon: 'medal', label: 'Badges', nav: 'Achievements', color: '#D97706', bg: '#fef3c7' }, 
              { icon: 'pie-chart', label: 'Stats', nav: 'EcoPointsDetails', color: '#4338CA', bg: '#e0e7ff' }, 
              { icon: 'chatbubbles', label: 'Social', nav: 'Chat', color: '#B45309', bg: '#ffedd5' }
            ].map((item, idx) => (
              <TouchableOpacity key={item.label} style={styles.quickLinkBtn} onPress={() => navigation.navigate(item.nav)}>
                <View style={[styles.quickLinkIconWrap, { backgroundColor: item.bg }]}>
                  <Ionicons name={item.icon} size={24} color={item.color} />
                </View>
                <Text style={styles.quickLinkLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Eco-Impact</Text>
              <TouchableOpacity onPress={() => navigation.navigate('EcoPointsDetails')}>
                <Text style={styles.seeAllText}>Overview</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.statsGrid}>
              {defaultStats.map((stat, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[styles.statCard, isTablet && styles.statCardTablet]} 
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate(stat.label === 'Rank' ? 'Leaderboard' : 'EcoPointsDetails')}
                >
                  <View style={[styles.statIconBadge, { backgroundColor: stat.bgColor }]}>
                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Badge Progress */}
          <TouchableOpacity onPress={() => navigation.navigate('Achievements')} style={styles.progressBox}>
            <View style={styles.progressHeader}>
              <Ionicons name="star" size={18} color={COLORS.accent} />
              <Text style={styles.progressTitle}>Progress to Eco Hero</Text>
              <Text style={styles.progressPercent}>{Math.round(progress * 100)}%</Text>
            </View>
            <View style={styles.progressBar}>
              <LinearGradient 
                colors={COLORS.gradientPrimary} 
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} 
                style={[styles.progressFill, { width: `${progress * 100}%` }]} 
              />
            </View>
          </TouchableOpacity>

          {/* Community Pulse */}
          <View style={styles.sectionSpacer}>
            <CommunityPulse />
          </View>

          {/* Top Recyclers Mini List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Recyclers</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.leaderboardCard}>
              {leaderboardPreview.map((usr, idx) => (
                <View key={usr.id} style={styles.leaderboardRow}>
                   <View style={styles.leaderboardRankBox}>
                      <Ionicons name="trophy" size={16} color={idx === 0 ? '#FBBF24' : '#94A3B8'} />
                   </View>
                   <Text style={styles.leaderboardName} numberOfLines={1}>{usr.name}</Text>
                   <Text style={styles.leaderboardPoints}>{usr.points} pts</Text>
                </View>
              ))}
            </View>
          </View>

        </RNAnimated.View>
      </ScrollView>

      {/* Floating Action Quick Menu */}
      {quickActionsVisible && (
        <RNAnimated.View style={[styles.fabOverlay, { opacity: quickActionsAnim }]}>
          <TouchableOpacity style={{flex: 1}} onPress={toggleQuickActions} activeOpacity={1} />
        </RNAnimated.View>
      )}
      
      <RNAnimated.View 
        style={[
          styles.fabMenu,
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
          <View>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.fabMenuItem}
                onPress={() => {
                  toggleQuickActions();
                  action.action();
                }}
              >m
                <View style={styles.fabMenuIcon}>
                  <Ionicons name={action.icon} size={20} color={COLORS.surface} />
                </View>
                <Text style={styles.fabMenuLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </RNAnimated.View>
        
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={toggleQuickActions}
        activeOpacity={0.9}
      >
        <Ionicons name={quickActionsVisible ? "close" : "grid"} size={26} color={COLORS.surface} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, // Fixed Premium Background
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.m,
    color: COLORS.primaryDark,
    fontSize: SIZES.body1,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.l,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : SIZES.m,
    paddingBottom: SIZES.m,
  },
  headerTablet: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  headerLeft: {
    flex: 1,
  },
  headerGreeting: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  headerUserName: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  avatarTouchable: {
    borderRadius: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    ...SHADOWS.small,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: SIZES.l,
    paddingBottom: SIZES.xxxl,
  },
  scrollContentTablet: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  sectionSpacer: {
    marginBottom: SIZES.xl,
  },
  challengeCard: {
    marginBottom: SIZES.xl,
    borderRadius: SIZES.radiusXl,
    ...SHADOWS.medium,
  },
  challengeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.l,
    borderRadius: SIZES.radiusXl,
  },
  challengeIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  challengeTextWrapper: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: SIZES.h4,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  challengeSubtitle: {
    fontSize: SIZES.caption,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.xl,
  },
  quickLinkBtn: {
    flex: 1,
    alignItems: 'center',
  },
  quickLinkIconWrap: {
    width: 56,
    height: 56,
    borderRadius: SIZES.radiusLg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
    ...SHADOWS.small,
  },
  quickLinkLabel: {
    fontSize: SIZES.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SIZES.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: SIZES.m,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: SIZES.body2,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SIZES.s,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radiusLg,
    alignItems: 'center',
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#E2E8F0' // Subtle border
  },
  statCardTablet: {
    padding: SIZES.l,
    borderRadius: SIZES.radiusXl,
  },
  statIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  statValue: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressBox: {
    backgroundColor: COLORS.surface,
    padding: SIZES.m,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.xl,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  progressTitle: {
    flex: 1,
    fontSize: SIZES.body2,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: SIZES.xs,
  },
  progressPercent: {
    fontSize: SIZES.body2,
    fontWeight: '800',
    color: COLORS.accent,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  leaderboardCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  leaderboardRankBox: {
    width: 32,
    alignItems: 'center',
  },
  leaderboardName: {
    flex: 1,
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: COLORS.text,
  },
  leaderboardPoints: {
    fontSize: SIZES.body2,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  fabOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    zIndex: 8,
  },
  fabMenu: {
    position: 'absolute',
    bottom: 100,
    right: SIZES.l,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    ...SHADOWS.large,
    zIndex: 9,
  },
  fabMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.s,
    paddingHorizontal: SIZES.xs,
  },
  fabMenuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  fabMenuLabel: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: COLORS.text,
    paddingRight: SIZES.m,
  },
  fabButton: {
    position: 'absolute',
    bottom: 30,
    right: SIZES.l,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.large,
    zIndex: 10,
  },
});

export default HomeScreen;