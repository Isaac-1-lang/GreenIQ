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

const { width, height } = Dimensions.get("window");

const companyTips = [
  { 
    text: '🏢 Did you know? Companies that implement recycling programs can reduce waste disposal costs by up to 50%!',
    likes: 45,
    liked: false
  },
  { 
    text: '💼 Tip: Set up designated recycling stations in your office to encourage employee participation.',
    likes: 32,
    liked: false
  },
  { 
    text: '📊 Fact: Businesses that go green often see improved employee satisfaction and retention.',
    likes: 67,
    liked: false
  },
  { 
    text: '🌿 Tip: Partner with local recycling facilities for better waste management solutions.',
    likes: 28,
    liked: false
  },
  { 
    text: '📈 Fact: Sustainable practices can improve your company\'s public image and attract eco-conscious customers.',
    likes: 89,
    liked: false
  },
  { 
    text: '📋 Tip: Track your waste collection data to identify opportunities for improvement and cost savings.',
    likes: 56,
    liked: false
  },
  { 
    text: '🎯 Fact: Companies with strong environmental policies often have higher employee engagement scores.',
    likes: 73,
    liked: false
  },
  { 
    text: '💡 Tip: Regular training sessions on waste segregation can significantly improve recycling rates.',
    likes: 41,
    liked: false
  }
];

const CompanyPortal = ({ navigation }) => {
  const [company, setCompany] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState(companyTips);
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
    // Using dummy company data
    const { dummyCompanyData } = require('../utils/dummyData');
    setCompany(dummyCompanyData);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Animate scan button
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(scanAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(scanAnim, {
          toValue: 0.9,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animate content fade in
    RNAnimated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Animate slide up
    RNAnimated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    // Using dummy data - simulating refresh
    const { dummyCompanyData } = require('../utils/dummyData');
    setCompany(dummyCompanyData);
    setIsOffline(false);
    setRefreshing(false);
  };

  const handleLikeTip = (index) => {
    const newTips = [...tips];
    newTips[index].liked = !newTips[index].liked;
    newTips[index].likes += newTips[index].liked ? 1 : -1;
    setTips(newTips);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleQuickActions = () => {
    setQuickActionsVisible(!quickActionsVisible);
    RNAnimated.timing(quickActionsAnim, {
      toValue: quickActionsVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleMapPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('SafeZonesMap');
  };

  const handleProfilePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CompanyProfile');
  };

  const handleCollectionManagementPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('CollectionMgmt');
  };

  const handleAnalyticsPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Analytics');
  };

  const handleEmployeeManagementPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Employees');
  };

  const compactBadgeCircle = (badge) => [
    {
      transform: [{ scale: scanAnim }],
    },
  ];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#11998e" />
        <Text style={styles.loadingText}>Loading Company Portal...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#43e97b", "#11998e"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#43e97b" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <RNAnimated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerTop}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.companyName}>
                  {company?.companyName || "Company"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={handleProfilePress}
              >
                <Ionicons name="person-circle" size={40} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {isOffline && (
              <View style={styles.offlineBanner}>
                <Ionicons name="wifi-off" size={16} color="#fff" />
                <Text style={styles.offlineText}>Offline Mode</Text>
              </View>
            )}
          </RNAnimated.View>

          {/* Company Stats */}
          <RNAnimated.View
            style={[
              styles.statsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="recycle" size={24} color="#11998e" />
                <Text style={styles.statNumber}>2,450</Text>
                <Text style={styles.statLabel}>Items Recycled</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="leaf" size={24} color="#11998e" />
                <Text style={styles.statNumber}>156</Text>
                <Text style={styles.statLabel}>CO2 Saved (kg)</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="people" size={24} color="#11998e" />
                <Text style={styles.statNumber}>25</Text>
                <Text style={styles.statLabel}>Employees</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Ionicons name="trending-up" size={24} color="#11998e" />
                <Text style={styles.statNumber}>$1,250</Text>
                <Text style={styles.statLabel}>Cost Savings</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="calendar" size={24} color="#11998e" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Collection Days</Text>
              </View>
              <View style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#11998e" />
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Efficiency Rate</Text>
              </View>
            </View>
          </RNAnimated.View>

          {/* Quick Actions */}
          <RNAnimated.View
            style={[
              styles.quickActionsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={handleCollectionManagementPress}
              >
                <LinearGradient
                  colors={["#11998e", "#43e97b"]}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="business" size={32} color="#fff" />
                  <Text style={styles.quickActionText}>Collection Mgmt</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={handleAnalyticsPress}
              >
                <LinearGradient
                  colors={["#11998e", "#43e97b"]}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="analytics" size={32} color="#fff" />
                  <Text style={styles.quickActionText}>Analytics</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={handleEmployeeManagementPress}
              >
                <LinearGradient
                  colors={["#11998e", "#43e97b"]}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="people-circle" size={32} color="#fff" />
                  <Text style={styles.quickActionText}>Employees</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.quickActionCard}
                onPress={handleMapPress}
              >
                <LinearGradient
                  colors={["#11998e", "#43e97b"]}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="map" size={32} color="#fff" />
                  <Text style={styles.quickActionText}>Collection Points</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </RNAnimated.View>

          {/* Company Tips */}
          <RNAnimated.View
            style={[
              styles.tipsContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.sectionTitle}>Company Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={20} color="#11998e" />
                <Text style={styles.tipTitle}>Sustainability Tip</Text>
              </View>
              <Text style={styles.tipText}>{tips[tipIndex].text}</Text>
              <View style={styles.tipFooter}>
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => handleLikeTip(tipIndex)}
                >
                  <Ionicons
                    name={tips[tipIndex].liked ? "heart" : "heart-outline"}
                    size={16}
                    color={tips[tipIndex].liked ? "#e74c3c" : "#666"}
                  />
                  <Text style={styles.likeCount}>{tips[tipIndex].likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nextTipButton}
                  onPress={() => setTipIndex((tipIndex + 1) % tips.length)}
                >
                  <Text style={styles.nextTipText}>Next Tip</Text>
                  <Ionicons name="chevron-forward" size={16} color="#11998e" />
                </TouchableOpacity>
              </View>
            </View>
          </RNAnimated.View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#43e97b',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeSection: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 4,
  },
  profileButton: {
    padding: 8,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  offlineText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '600',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#11998e',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  quickActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#11998e',
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 16,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  nextTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextTipText: {
    fontSize: 12,
    color: '#11998e',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default CompanyPortal; 