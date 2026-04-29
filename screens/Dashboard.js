import React, { useContext, useState, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  Dimensions,
  StatusBar,
  Animated,
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useWindowDimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

const mockStats = {
  collectionPointsCount: 12,
  itemsRecycled: 4250,
  activeUsers: 856,
  monthlyGrowth: 15,
  co2Saved: 12.5, 
  pointsDistributed: 15400,
  topRecyclers: [
    { id: 1, name: 'EcoWarrior John', points: 450, items: 120 },
    { id: 2, name: 'Green Sarah', points: 380, items: 95 },
    { id: 3, name: 'RecyclePro Mike', points: 320, items: 80 },
  ],
  recentActivities: [
    { id: 1, action: 'New collection point added', location: 'Gasabo District', time: '2 hours ago', type: 'success' },
    { id: 2, action: 'Maintenance scheduled', location: 'Kigali Central', time: '4 hours ago', type: 'warning' },
    { id: 3, action: 'Point capacity reached', location: 'Nyamirambo', time: '6 hours ago', type: 'error' },
    { id: 4, action: 'Weekly report generated', location: 'System', time: '1 day ago', type: 'info' },
  ],
  collectionPointsList: [
    { id: 1, name: 'Kigali Central Hub', status: 'Operational', capacity: 85, location: 'Central Kigali', dailyCollection: 245, coordinates: { lat: -1.9441, lng: 30.0619 } },
    { id: 2, name: 'Nyamirambo Station', status: 'Full', capacity: 100, location: 'Nyamirambo', dailyCollection: 189, coordinates: { lat: -1.9706, lng: 30.0588 } },
    { id: 3, name: 'Kimironko Center', status: 'Operational', capacity: 67, location: 'Kimironko', dailyCollection: 156, coordinates: { lat: -1.9355, lng: 30.1123 } },
    { id: 4, name: 'Remera Point', status: 'Maintenance', capacity: 45, location: 'Remera', dailyCollection: 98, coordinates: { lat: -1.9578, lng: 30.1066 } },
    { id: 5, name: 'Gikondo Industrial', status: 'Operational', capacity: 78, location: 'Gikondo', dailyCollection: 287, coordinates: { lat: -1.9884, lng: 30.0644 } },
    { id: 6, name: 'Nyabugogo Terminal', status: 'Operational', capacity: 92, location: 'Nyabugogo', dailyCollection: 134, coordinates: { lat: -1.9355, lng: 30.0588 } },
  ],
  weeklyData: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [235, 287, 356, 298, 445, 398, 234],
      color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`, // Using primary color
      strokeWidth: 3,
    }],
  },
  materialTypes: [
    { name: 'Plastic', population: 35, color: '#0EA5E9', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Glass', population: 25, color: '#10B981', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Paper', population: 20, color: '#8B5CF6', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Metal', population: 15, color: '#F59E0B', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Other', population: 5, color: '#94A3B8', legendFontColor: '#333', legendFontSize: 12 },
  ],
};

const ecoTips = [
  'Rinse containers before recycling to avoid contamination.',
  'Bring your own bag to reduce plastic waste.',
  'Flatten cardboard boxes to save space in recycling bins.',
  'Electronics should be recycled at special drop-off points.',
  'Compost food scraps to reduce landfill waste.'
];

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredPoints = useMemo(() => {
    return mockStats.collectionPointsList.filter(point =>
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const window = useWindowDimensions();
  const isTablet = window.width >= 900;
  const isLandscape = window.width > window.height;

  const email = user?.email || 'admin@rca.com'; // Fallback for mockup viewing

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const mainAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(mainAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const [ecoTipIndex, setEcoTipIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setEcoTipIndex((prev) => (prev + 1) % ecoTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!email.endsWith('@rca.com')) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <View style={styles.deniedContainer}>
          <Ionicons name="shield-checkmark-outline" size={80} color={COLORS.error} />
          <Text style={styles.deniedText}>Access Restricted</Text>
          <Text style={styles.deniedSub}>
            This government dashboard requires authorized RCA credentials.
          </Text>
          <TouchableOpacity style={styles.contactButton} onPress={() => Alert.alert('Contact', 'Please contact your system administrator for access.')}>
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handlePointPress = (point) => {
    setSelectedPoint(point);
    setModalVisible(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Operational': return COLORS.success;
      case 'Full': return COLORS.error;
      case 'Maintenance': return COLORS.warning;
      default: return COLORS.textMuted;
    }
  };

  const getCapacityColor = (capacity) => {
    if (capacity >= 90) return COLORS.error;
    if (capacity >= 70) return COLORS.warning;
    return COLORS.success;
  };

  const renderMetricsGrid = () => {
    const metrics = [
      {
        icon: 'location',
        value: mockStats.collectionPointsCount,
        label: 'Points',
        color: COLORS.primary,
        bgColor: '#CCFBF1',
      },
      {
        icon: 'leaf',
        value: mockStats.itemsRecycled.toLocaleString(),
        label: 'Items',
        color: COLORS.accent,
        bgColor: '#D1FAE5',
      },
      {
        icon: 'people',
        value: mockStats.activeUsers.toLocaleString(),
        label: 'Users',
        color: COLORS.secondary,
        bgColor: '#DBEAFE',
      },
      {
        icon: 'trending-up',
        value: `+${mockStats.monthlyGrowth}%`,
        label: 'Growth',
        color: COLORS.warning,
        bgColor: '#FEF3C7',
      },
    ];
    
    return (
      <View style={styles.metricsGrid}>
        {metrics.map((metric, idx) => (
          <View key={metric.label} style={[styles.metricCard, isTablet && styles.metricCardTablet]}>
            <View style={[styles.metricIconBox, { backgroundColor: metric.bgColor }]}>
              <Ionicons name={metric.icon} size={isTablet ? 28 : 24} color={metric.color} />
            </View>
            <Text style={[styles.metricValue, isTablet && styles.metricValueTablet]}>{metric.value}</Text>
            <Text style={[styles.metricLabel, isTablet && styles.metricLabelTablet]}>{metric.label}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <Animated.View style={{
            opacity: mainAnim,
            transform: [{ translateY: mainAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
          }}>
            <View style={styles.dashboardHeader}>
              <Text style={styles.dashboardTitle}>Welcome back, Admin 👋</Text>
              <Text style={styles.dashboardSubtitle}>Here's what's happening with the recycling centers today.</Text>
            </View>

            {/* Quick Actions */}
            <View style={styles.quickActionsRow}>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Add Point', 'Add new!')}>
                <View style={[styles.quickActionIconBg, { backgroundColor: '#E0F2FE' }]}>
                  <Ionicons name="add-circle" size={24} color={COLORS.secondary} />
                </View>
                <Text style={styles.quickActionText}>New Point</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Report', 'Generate!')}>
                <View style={[styles.quickActionIconBg, { backgroundColor: '#F3E8FF' }]}>
                  <Ionicons name="document-text" size={24} color="#9333EA" />
                </View>
                <Text style={styles.quickActionText}>Reports</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton} onPress={() => Alert.alert('Broadcast', 'Send SMS!')}>
                <View style={[styles.quickActionIconBg, { backgroundColor: '#FFEDD5' }]}>
                  <Ionicons name="megaphone" size={24} color="#EA580C" />
                </View>
                <Text style={styles.quickActionText}>Alerts</Text>
              </TouchableOpacity>
            </View>

            {/* Eco Tip */}
            <LinearGradient colors={['#F0FDF4', '#DCFCE7']} style={styles.ecoTipCard}>
              <Ionicons name="bulb" size={24} color={COLORS.accent} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.ecoTipTitle}>System Tip</Text>
                <Text style={styles.ecoTipText}>{ecoTips[ecoTipIndex]}</Text>
              </View>
            </LinearGradient>

            {/* Key Metrics Grid */}
            {renderMetricsGrid()}

            {/* Safe Zones Map Preview */}
            <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet, { padding: 0, overflow: 'hidden' }]}> 
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Live Operations Map</Text>
                <TouchableOpacity onPress={() => setSelectedTab('points')}>
                  <Text style={styles.sectionAction}>View All</Text>
                </TouchableOpacity>
              </View>
              <MapView
                style={styles.mapPreview}
                initialRegion={{
                  latitude: -1.9403,
                  longitude: 30.0739,
                  latitudeDelta: 0.12,
                  longitudeDelta: 0.12,
                }}
                pointerEvents="none"
              >
                {mockStats.collectionPointsList.map(point => (
                  <Marker
                    key={point.id}
                    coordinate={{ latitude: point.coordinates.lat, longitude: point.coordinates.lng }}
                    pinColor={point.status === 'Operational' ? COLORS.success : COLORS.error}
                  />
                ))}
              </MapView>
            </View>

            {/* Weekly Collection Chart */}
            <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
              <Text style={styles.sectionTitle}>Weekly Collection Trends</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={mockStats.weeklyData}
                  width={(isTablet ? 700 : screenWidth - 64)} // Adjust for padding
                  height={isTablet ? 280 : 220}
                  chartConfig={{
                    backgroundColor: COLORS.surface,
                    backgroundGradientFrom: COLORS.surface,
                    backgroundGradientTo: COLORS.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(15, 118, 110, ${opacity})`,
                    labelColor: (opacity = 1) => COLORS.textSecondary,
                    style: { borderRadius: 16 },
                    propsForDots: {
                      r: isTablet ? '6' : '4',
                      strokeWidth: '2',
                      stroke: COLORS.primaryDark,
                    },
                    propsForBackgroundLines: {
                      stroke: '#E2E8F0',
                      strokeDasharray: '4',
                    }
                  }}
                  bezier
                  style={styles.chart}
                />
              </ScrollView>
            </View>
          </Animated.View>
        );

      case 'points':
        return (
          <Animated.View style={{ opacity: mainAnim }}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search collection points..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <FlatList
              data={filteredPoints}
              keyExtractor={item => item.id.toString()}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.pointCard} onPress={() => handlePointPress(item)} activeOpacity={0.7}>
                  <View style={styles.pointHeader}>
                    <View style={styles.pointInfo}>
                      <Text style={styles.pointName}>{item.name}</Text>
                      <Text style={styles.pointLocation}>
                        <Ionicons name="location" size={12} color={COLORS.textMuted} /> {item.location}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.pointMetrics}>
                    <View style={styles.pointMetric}>
                      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4}}>
                        <Text style={styles.metricText}>Capacity</Text>
                        <Text style={styles.metricNumberSmall}>{item.capacity}%</Text>
                      </View>
                      <View style={styles.capacityBar}>
                        <View style={[styles.capacityFill, { 
                          width: `${item.capacity}%`, 
                          backgroundColor: getCapacityColor(item.capacity) 
                        }]} />
                      </View>
                    </View>
                    <View style={[styles.pointMetric, { marginLeft: SIZES.l, flex: 0.5 }]}>
                      <Text style={styles.metricText}>Daily Avg</Text>
                      <Text style={[styles.metricNumberSmall, { marginTop: 2 }]}>{item.dailyCollection} <Text style={{fontSize:10, color: COLORS.textMuted}}>items</Text></Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Animated.View>
        );

      case 'analytics':
        return (
          <Animated.View style={{ opacity: mainAnim }}>
            {/* Material Distribution */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Material Distribution</Text>
              <PieChart
                data={mockStats.materialTypes}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>

            {/* Environmental Impact */}
            <View style={[styles.sectionCard, isTablet && styles.sectionCardTablet]}>
              <Text style={styles.sectionTitle}>Environmental Impact</Text>
              <View style={styles.impactRow}>
                <View style={styles.impactItem}>
                  <View style={[styles.impactIconBg, {backgroundColor: '#ECFDF5'}]}>
                    <Ionicons name="cloud" size={28} color={COLORS.accent} />
                  </View>
                  <Text style={styles.impactValue}>{mockStats.co2Saved}t</Text>
                  <Text style={styles.impactLabel}>CO₂ Saved</Text>
                </View>
                <View style={styles.impactItem}>
                  <View style={[styles.impactIconBg, {backgroundColor: '#FEFCE8'}]}>
                    <Ionicons name="star" size={28} color={COLORS.warning} />
                  </View>
                  <Text style={styles.impactValue}>{mockStats.pointsDistributed >= 1000 ? `${(mockStats.pointsDistributed/1000).toFixed(1)}k` : mockStats.pointsDistributed}</Text>
                  <Text style={styles.impactLabel}>Points Dist.</Text>
                </View>
              </View>
            </View>

            {/* Top Recyclers */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>Top Recyclers This Month</Text>
              {mockStats.topRecyclers.map((recycler, index) => (
                <View key={recycler.id} style={styles.recyclerRow}>
                  <View style={styles.recyclerRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.recyclerInfo}>
                    <Text style={styles.recyclerName}>{recycler.name}</Text>
                    <Text style={styles.recyclerStats}>
                      <Ionicons name="leaf" size={12} color={COLORS.accent} /> {recycler.points} points
                    </Text>
                  </View>
                  <Ionicons name="trophy" size={24} color={index === 0 ? '#FBBF24' : index === 1 ? '#94A3B8' : '#B45309'} />
                </View>
              ))}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerSubtitle}>Government Dashboard</Text>
            <Text style={styles.headerTitle}>GreenIQ Admin</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationIconBg}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primaryDark} />
            </View>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[ 
              { key: 'overview', label: 'Overview', icon: 'analytics' },
              { key: 'points', label: 'Facilities', icon: 'location' },
              { key: 'analytics', label: 'Analytics', icon: 'pie-chart' },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
                onPress={() => setSelectedTab(tab.key)}
              >
                <Ionicons name={tab.icon} size={20} color={selectedTab === tab.key ? COLORS.surface : 'rgba(255,255,255,0.6)'} />
                <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: SIZES.xxxl }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
        showsVerticalScrollIndicator={false}
      >
        {renderTabContent()}
      </ScrollView>

      {/* Point Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedPoint && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedPoint.name}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeModalBtn}>
                    <Ionicons name="close" size={24} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalBody}>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Status:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(selectedPoint.status)}20` }]}>
                      <Text style={[styles.statusText, {color: getStatusColor(selectedPoint.status)}]}>{selectedPoint.status}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Location:</Text>
                    <Text style={styles.modalValue}>{selectedPoint.location}</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Capacity:</Text>
                    <Text style={[styles.modalValue, {color: getCapacityColor(selectedPoint.capacity)}]}>{selectedPoint.capacity}%</Text>
                  </View>
                  
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Daily Average:</Text>
                    <Text style={styles.modalValue}>{selectedPoint.dailyCollection} items</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Manage Facility</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomLeftRadius: SIZES.radiusXl,
    borderBottomRightRadius: SIZES.radiusXl,
    ...SHADOWS.medium,
    zIndex: 10,
  },
  headerTop: {
    paddingHorizontal: SIZES.l,
    paddingVertical: SIZES.m,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.surface,
  },
  headerSubtitle: {
    fontSize: SIZES.body2,
    color: COLORS.primaryLight,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  notificationButton: {
    position: 'relative',
  },
  notificationIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.primaryDark,
  },
  notificationCount: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tabContainer: {
    paddingHorizontal: SIZES.s,
    marginBottom: SIZES.m,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.m,
    paddingVertical: SIZES.s,
    marginHorizontal: SIZES.xs,
    borderRadius: SIZES.radiusPill,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  activeTab: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  tabText: {
    marginLeft: SIZES.xs,
    fontSize: SIZES.body2,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  activeTabText: {
    color: COLORS.surface,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    padding: SIZES.m,
  },
  dashboardHeader: {
    marginBottom: SIZES.l,
    paddingHorizontal: SIZES.xs,
  },
  dashboardTitle: {
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: '800',
    marginBottom: 4,
  },
  dashboardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SIZES.l,
    gap: SIZES.s,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickActionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  quickActionText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: SIZES.caption,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.l,
  },
  metricCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.m,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
  },
  metricCardTablet: {
    width: '23%',
  },
  metricIconBox: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  metricValue: {
    color: COLORS.text,
    fontSize: SIZES.h2,
    fontWeight: '800',
  },
  metricLabel: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.l,
    marginBottom: SIZES.l,
    ...SHADOWS.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.l,
    paddingBottom: SIZES.m,
  },
  sectionTitle: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionAction: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: SIZES.body2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.l,
    paddingHorizontal: SIZES.m,
    height: 56,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.text,
    marginLeft: SIZES.s,
  },
  pointCard: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.l,
    marginBottom: SIZES.m,
    ...SHADOWS.small,
  },
  pointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SIZES.m,
  },
  pointInfo: {
    flex: 1,
  },
  pointName: {
    fontSize: SIZES.h4,
    fontWeight: '700',
    color: COLORS.text,
  },
  pointLocation: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: SIZES.radiusPill,
  },
  statusText: {
    fontSize: SIZES.caption,
    fontWeight: '700',
  },
  pointMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointMetric: {
    flex: 1,
  },
  metricNumberSmall: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: COLORS.text,
  },
  metricText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  capacityBar: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  mapPreview: {
    width: '100%',
    height: 200,
  },
  ecoTipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radiusXl,
    padding: SIZES.m,
    marginBottom: SIZES.l,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  ecoTipTitle: {
    color: COLORS.primaryDark,
    fontSize: SIZES.caption,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  ecoTipText: {
    color: COLORS.primaryDark,
    fontSize: SIZES.body2,
    fontWeight: '500',
  },
  chart: {
    marginVertical: SIZES.s,
    borderRadius: SIZES.radiusLg,
  },
  impactRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SIZES.s,
  },
  impactItem: {
    alignItems: 'center',
  },
  impactIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  impactValue: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.text,
  },
  impactLabel: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  recyclerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recyclerRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  rankNumber: {
    fontSize: SIZES.body2,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  recyclerInfo: {
    flex: 1,
  },
  recyclerName: {
    fontSize: SIZES.body1,
    fontWeight: '700',
    color: COLORS.text,
  },
  recyclerStats: {
    fontSize: SIZES.body2,
    color: COLORS.accent,
    fontWeight: '600',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    minHeight: '60%',
    padding: SIZES.l,
    ...SHADOWS.large,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.l,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  closeModalBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalLabel: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  modalValue: {
    fontSize: SIZES.body1,
    color: COLORS.text,
    fontWeight: '700',
  },
  actionButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusPill,
    paddingVertical: SIZES.m,
    alignItems: 'center',
    marginTop: SIZES.xl,
    ...SHADOWS.medium,
  },
  actionButtonText: {
    color: COLORS.surface,
    fontSize: SIZES.h4,
    fontWeight: '700',
  },
  deniedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.xl,
  },
  deniedText: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.error,
    marginTop: SIZES.m,
  },
  deniedSub: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SIZES.s,
    marginBottom: SIZES.xl,
  },
  contactButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SIZES.m,
    paddingHorizontal: SIZES.xl,
    borderRadius: SIZES.radiusPill,
    borderWidth: 2,
    borderColor: COLORS.error,
  },
  contactButtonText: {
    color: COLORS.error,
    fontSize: SIZES.body1,
    fontWeight: '700',
  },
});

export default Dashboard;