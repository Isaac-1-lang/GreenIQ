import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Animated as RNAnimated,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const { width } = Dimensions.get("window");

const companyTips = [
  { text: '🏢 Did you know? Dedicated routes save up to 15% in fuel costs weekly.', likes: 45, liked: false },
  { text: '💼 Tip: Optimize truck capacity by ensuring compacting protocols are followed.', likes: 32, liked: false },
];

// Truck Routing Points mock (Kigali)
const routePickups = [
  { id: '1', title: 'Nyarugenge Market', type: 'High Volume', coords: { latitude: -1.9441, longitude: 30.0619 } },
  { id: '2', title: 'Kacyiru Office Hub', type: 'Paper & Plastic', coords: { latitude: -1.9300, longitude: 30.0900 } },
  { id: '3', title: 'Kimironko Center', type: 'Mixed Waste', coords: { latitude: -1.9355, longitude: 30.1123 } },
];

const CompanyPortal = ({ navigation }) => {
  const [company, setCompany] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState(companyTips);
  
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  
  const window = useWindowDimensions();
  const isTablet = window.width >= 700;

  useEffect(() => {
    // Simulator delay load
    setTimeout(() => {
      const { dummyCompanyData } = require('../utils/dummyData');
      setCompany(dummyCompanyData);
      setIsLoading(false);
      
      RNAnimated.parallel([
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
      setRefreshing(false);
    }, 1000);
  };

  const handleLikeTip = (index) => {
    const newTips = [...tips];
    newTips[index].liked = !newTips[index].liked;
    newTips[index].likes += newTips[index].liked ? 1 : -1;
    setTips(newTips);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openMapsDirections = () => {
    // Navigates to first pickup logic
    const point = routePickups[0].coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`;
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading Company Portal...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Premium Deep Green Header */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <View style={styles.headerLeft}>
           <Text style={styles.headerGreeting}>Company Portal</Text>
           <Text style={styles.headerTitle}>{company?.companyName || "GreenTech Partners"}</Text>
        </View>
        <TouchableOpacity 
           style={styles.profileBtn}
           onPress={() => navigation.navigate('CompanyProfile')}
        >
           <Ionicons name="business" size={28} color={COLORS.primaryDark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
      >
        <RNAnimated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          
          {/* Quick Actions Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsScroll}>
            {[
              { icon: 'trash-bin', label: 'Collections', nav: 'CollectionMgmt', bg: '#D1FAE5', color: COLORS.primaryDark },
              { icon: 'people', label: 'Drivers', nav: 'Employees', bg: '#DBEAFE', color: '#2563EB' },
              { icon: 'pie-chart', label: 'Analytics', nav: 'Analytics', bg: '#FEF3C7', color: '#D97706' },
              { icon: 'map', label: 'Zone Map', nav: 'SafeZonesMap', bg: '#FCE7F3', color: '#BE185D' }
            ].map((action, idx) => (
               <TouchableOpacity 
                  key={idx} 
                  style={styles.actionPill}
                  onPress={() => navigation.navigate(action.nav)}
               >
                 <View style={[styles.actionIconBg, { backgroundColor: action.bg }]}>
                    <Ionicons name={action.icon} size={20} color={action.color} />
                 </View>
                 <Text style={styles.actionPillText}>{action.label}</Text>
               </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ACTIVE TRUCK ROUTING MAP WIDGET */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
               <View style={{flexDirection: 'row', alignItems: 'center'}}>
                 <Ionicons name="bus" size={24} color={COLORS.primary} style={{marginRight: 8}} />
                 <Text style={styles.sectionTitle}>Live Truck Route</Text>
               </View>
               <View style={styles.activeBadge}>
                 <Text style={styles.activeBadgeText}>ACTIVE</Text>
               </View>
            </View>
            
            <View style={styles.mapCard}>
               <MapView
                  style={styles.mapView}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={{
                    latitude: -1.9380,
                    longitude: 30.0800,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
               >
                 {routePickups.map((pt, i) => (
                    <Marker key={i} coordinate={pt.coords}>
                       <View style={styles.routeMarker}>
                         <Text style={styles.routeMarkerText}>{i+1}</Text>
                       </View>
                    </Marker>
                 ))}
                 <Polyline 
                   coordinates={routePickups.map(r => r.coords)}
                   strokeColor={COLORS.primary}
                   strokeWidth={4}
                 />
               </MapView>
               
               <View style={styles.mapFooter}>
                 <View style={{flex: 1}}>
                    <Text style={styles.mapStopsText}>Next stop: <Text style={{fontWeight: '800', color: COLORS.text}}>{routePickups[0].title}</Text></Text>
                    <Text style={styles.mapRemainingText}>{routePickups.length} scheduled pickups</Text>
                 </View>
                 <TouchableOpacity style={styles.navButton} onPress={openMapsDirections}>
                    <Ionicons name="navigate" size={18} color={COLORS.surface} style={{marginRight: 6}} />
                    <Text style={styles.navButtonText}>Start</Text>
                 </TouchableOpacity>
               </View>
            </View>
          </View>

          {/* Key Metrics Dashboard */}
          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Fleet Performance</Text>
             <View style={styles.statsGrid}>
                {[
                  { value: '2,450', label: 'Tons Collected', icon: 'server' },
                  { value: '156 kg', label: 'CO2 Offset', icon: 'leaf' },
                  { value: '85%', label: 'Efficiency', icon: 'speedometer' },
                  { value: '$1.2k', label: 'Fuel Saved', icon: 'wallet' }
                ].map((stat, i) => (
                   <View key={i} style={[styles.statBox, isTablet && styles.statBoxTablet]}>
                      <Ionicons name={stat.icon} size={22} color={COLORS.primary} style={{marginBottom: SIZES.s}} />
                      <Text style={styles.statBoxValue}>{stat.value}</Text>
                      <Text style={styles.statBoxLabel}>{stat.label}</Text>
                   </View>
                ))}
             </View>
          </View>

          {/* Company Tips */}
          <View style={[styles.section, {marginBottom: 40}]}>
            <Text style={styles.sectionTitle}>Operational Insights</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipHeader}>
                <Ionicons name="bulb" size={24} color={COLORS.warning} />
                <Text style={styles.tipTitle}>Efficiency Tip</Text>
              </View>
              <Text style={styles.tipText}>{tips[tipIndex].text}</Text>
              
              <View style={styles.tipFooter}>
                <TouchableOpacity style={styles.likeButton} onPress={() => handleLikeTip(tipIndex)}>
                  <Ionicons name={tips[tipIndex].liked ? "heart" : "heart-outline"} size={20} color={tips[tipIndex].liked ? COLORS.error : COLORS.textMuted} />
                  <Text style={styles.likeCount}>{tips[tipIndex].likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextTipButton} onPress={() => setTipIndex((tipIndex + 1) % tips.length)}>
                  <Text style={styles.nextTipText}>Next Insight</Text>
                  <Ionicons name="chevron-forward-circle" size={20} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

        </RNAnimated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.m,
    color: COLORS.primaryDark,
    fontSize: SIZES.h4,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.l,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : SIZES.m,
    paddingBottom: SIZES.l,
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
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  profileBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  scrollContent: {
    paddingBottom: SIZES.xl,
  },
  scrollContentTablet: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  quickActionsScroll: {
    paddingHorizontal: SIZES.m,
    paddingBottom: SIZES.s,
    marginBottom: SIZES.xl,
    gap: SIZES.s,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.xs,
    paddingRight: SIZES.l,
    borderRadius: SIZES.radiusPill,
    marginRight: SIZES.s,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  actionPillText: {
    fontSize: SIZES.body2,
    fontWeight: '700',
    color: COLORS.text,
  },
  section: {
    paddingHorizontal: SIZES.l,
    marginBottom: SIZES.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  sectionTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  activeBadge: {
    backgroundColor: COLORS.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mapCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    overflow: 'hidden',
    ...SHADOWS.medium,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mapView: {
    width: '100%',
    height: 180,
  },
  routeMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
    ...SHADOWS.small,
  },
  routeMarkerText: {
    color: COLORS.surface,
    fontSize: 10,
    fontWeight: '800',
  },
  mapFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SIZES.m,
    backgroundColor: COLORS.surface,
  },
  mapStopsText: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
  },
  mapRemainingText: {
    fontSize: SIZES.caption,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.m,
    paddingVertical: 10,
    borderRadius: SIZES.radiusPill,
    ...SHADOWS.small,
  },
  navButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: SIZES.body2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SIZES.m,
    marginTop: SIZES.s,
  },
  statBox: {
    width: '47%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.l,
    ...SHADOWS.small,
    borderWidth: 1,
    borderColor: '#F8FAFC',
  },
  statBoxTablet: {
    width: '23%',
  },
  statBoxValue: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.text,
  },
  statBoxLabel: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 4,
  },
  tipCard: {
    backgroundColor: '#FFFBEB', // Light amber background
    borderRadius: SIZES.radiusXl,
    padding: SIZES.xl,
    marginTop: SIZES.s,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  tipTitle: {
    fontSize: SIZES.body1,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 8,
  },
  tipText: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: SIZES.xl,
  },
  tipFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#FEF3C7',
    paddingTop: SIZES.m,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: SIZES.body2,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  nextTipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
  },
  nextTipText: {
    fontSize: SIZES.caption,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginRight: 4,
  },
});

export default CompanyPortal;