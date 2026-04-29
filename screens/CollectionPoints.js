import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal, Linking, StatusBar } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const kigaliBase = { lat: -1.9441, lng: 30.0619 };
// Dispersed locations around Kigali to prevent overlapping
export const wastePoints = [
  { id: 1, name: 'Nyarugenge Central Point', district: 'Nyarugenge', sector: 'Nyarugenge', coords: { latitude: -1.9441, longitude: 30.0619 }, types: ['Recyclable wastes', 'Plastic', 'Electronic'], hours: 'Mon-Sat: 7:00 AM - 6:00 PM', contact: '+250 788 123 456', capacity: 'High', status: 'Operational', description: 'Major resource recovery in central Kigali.', manager: 'Jean Paul' },
  { id: 2, name: 'Nyamirambo Station', district: 'Nyarugenge', sector: 'Nyamirambo', coords: { latitude: -1.9706, longitude: 30.0588 }, types: ['Non biodegradable', 'Hazardous', 'Organic'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 234 567', capacity: 'High', status: 'Operational', description: 'Waste processing facility for southern urban sectors.', manager: 'Marie Claire' },
  { id: 3, name: 'Kimironko Market Hub', district: 'Gasabo', sector: 'Kimironko', coords: { latitude: -1.9355, longitude: 30.1123 }, types: ['Organic', 'Plastic', 'Paper'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 345 678', capacity: 'Medium', status: 'Operational', description: 'Serving the market district.', manager: 'Eric Nizeyimana' },
  { id: 4, name: 'Remera Point', district: 'Gasabo', sector: 'Remera', coords: { latitude: -1.9578, longitude: 30.1066 }, types: ['Paper', 'Glass', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 456 789', capacity: 'Medium', status: 'Operational', description: 'Premium recycling near the stadium complex.', manager: 'Aline Uwineza' },
  { id: 5, name: 'Gikondo Industrial', district: 'Kicukiro', sector: 'Gikondo', coords: { latitude: -1.9884, longitude: 30.0644 }, types: ['Metal', 'Electronic'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 567 890', capacity: 'Low', status: 'Operational', description: 'Handling large-scale scrap and electronics.', manager: 'David Muhire' },
  { id: 6, name: 'Kacyiru Office Hub', district: 'Gasabo', sector: 'Kacyiru', coords: { latitude: -1.9300, longitude: 30.0900 }, types: ['Paper', 'Plastic'], hours: 'Mon-Fri: 7:30 AM - 5:30 PM', contact: '+250 788 678 901', capacity: 'Low', status: 'Limited', description: 'Corporate recycling zone.', manager: 'Grace Mutoni' },
  { id: 7, name: 'Gisozi Depot', district: 'Gasabo', sector: 'Gisozi', coords: { latitude: -1.9213, longitude: 30.0768 }, types: ['Wood', 'Metal', 'Construction'], hours: 'Mon-Sat: 7:30 AM - 5:30 PM', contact: '+250 788 789 012', capacity: 'Medium', status: 'Operational', description: 'Near Gisozi woodworking area.', manager: 'Samuel Kamari' },
  { id: 8, name: 'Nyabugogo Terminal Hub', district: 'Nyarugenge', sector: 'Nyabugogo', coords: { latitude: -1.9355, longitude: 30.0488 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sun: 6:00 AM - 8:00 PM', contact: '+250 788 890 123', capacity: 'High', status: 'Operational', description: 'Terminal-side heavy traffic collection.', manager: 'Olivier Ndushabandi' },
  { id: 9, name: 'Niboye Station', district: 'Kicukiro', sector: 'Niboye', coords: { latitude: -1.9800, longitude: 30.1100 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+250 788 901 234', capacity: 'Medium', status: 'Operational', description: 'Suburban waste sorting.', manager: 'Divine Uwera' },
  { id: 10, name: 'Kagugu Point', district: 'Gasabo', sector: 'Kagugu', coords: { latitude: -1.9100, longitude: 30.0800 }, types: ['Paper', 'Glass'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+250 788 012 345', capacity: 'Low', status: 'Operational', description: 'Residential drop-off point.', manager: 'Moses Mugisha' },
  // Adding coordinates slightly offset from main sectors for dispersion
  { id: 11, name: 'Kabeza Hub', district: 'Kicukiro', sector: 'Kabeza', coords: { latitude: -1.9600, longitude: 30.1300 }, types: ['Electronic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 111 222', capacity: 'Medium', status: 'Operational', description: 'E-waste target area.', manager: 'Sarah Niyonsaba' },
  { id: 12, name: 'Kanombe Station', district: 'Kicukiro', sector: 'Kanombe', coords: { latitude: -1.9650, longitude: 30.1500 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 788 222 333', capacity: 'Low', status: 'Operational', description: 'Airport vicinity collection.', manager: 'Faustin Habimana' },
  { id: 13, name: 'Masaka Depot', district: 'Kicukiro', sector: 'Masaka', coords: { latitude: -1.9800, longitude: 30.1800 }, types: ['Organic', 'Medical'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 333 444', capacity: 'High', status: 'Operational', description: 'Specialized facility.', manager: 'Hope Kamanzi' },
  { id: 14, name: 'Kabuga Point', district: 'Gasabo', sector: 'Kabuga', coords: { latitude: -1.9900, longitude: 30.2200 }, types: ['Plastic', 'Paper'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 444 555', capacity: 'Medium', status: 'Operational', description: 'Edge of Kigali collection zone.', manager: 'Chris Rurangwa' },
  { id: 15, name: 'Kimisagara Recycling', district: 'Nyarugenge', sector: 'Kimisagara', coords: { latitude: -1.9560, longitude: 30.0450 }, types: ['Organic', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:00 PM', contact: '+250 788 555 666', capacity: 'Medium', status: 'Operational', description: 'Dense urban collection point.', manager: 'Angele Umutoni' },
  { id: 16, name: 'Chic Building Zone', district: 'Nyarugenge', sector: 'Nyarugenge', coords: { latitude: -1.9420, longitude: 30.0650 }, types: ['Paper', 'Plastic'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 666 777', capacity: 'High', status: 'Operational', description: 'Commercial center point.', manager: 'Vianney Gatete' },
  { id: 17, name: 'Amahoro Stadium Point', district: 'Gasabo', sector: 'Remera', coords: { latitude: -1.9540, longitude: 30.1130 }, types: ['Plastic', 'Organic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+250 788 777 888', capacity: 'Medium', status: 'Operational', description: 'Events processing zone.', manager: 'Patience Bwiza' },
  { id: 18, name: 'Kigali Heights Point', district: 'Gasabo', sector: 'Kimihurura', coords: { latitude: -1.9480, longitude: 30.0930 }, types: ['Glass', 'Paper'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+250 788 888 999', capacity: 'Low', status: 'Operational', description: 'Office and restaurant waste.', manager: 'Didier Mugiraneza' },
  { id: 19, name: 'Nyanza Sector Hub', district: 'Kicukiro', sector: 'Nyanza', coords: { latitude: -1.9950, longitude: 30.0850 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 999 000', capacity: 'Medium', status: 'Operational', description: 'Outskirts depot.', manager: 'Clementine Nikuze' },
  { id: 20, name: 'Kibagabaga Recycling', district: 'Gasabo', sector: 'Kibagabaga', coords: { latitude: -1.9310, longitude: 30.1210 }, types: ['Plastic', 'Electronic'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 783 123 456', capacity: 'Medium', status: 'Operational', description: 'Residential tech sorting.', manager: 'Bertrand Rwigema' },
  { id: 21, name: 'Nyarutarama Point', district: 'Gasabo', sector: 'Remera', coords: { latitude: -1.9350, longitude: 30.1010 }, types: ['Organic', 'Glass'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 783 234 567', capacity: 'Low', status: 'Operational', description: 'Premium sorting site.', manager: 'Alice Kamanzi' }
];

const CollectionPoints = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  
  const dummyNotifications = [
    { id: 1, text: 'Heavy rainfall expected in Gasabo. Safe zones open for shelter.' },
    { id: 2, text: 'Flood risk near Nyabugogo. Use alternate collection points.' },
    { id: 3, text: 'Umuganda Alert: All collection points close early this Saturday.' },
  ];

  const rwandaRegion = {
    latitude: -1.9441,
    longitude: 30.0619,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        // Optional: pan to user location
      }
    })();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = wastePoints.filter(point => 
        point.name.toLowerCase().includes(text.toLowerCase()) ||
        point.district.toLowerCase().includes(text.toLowerCase()) ||
        point.sector.toLowerCase().includes(text.toLowerCase()) ||
        point.types.some(type => type.toLowerCase().includes(text.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
    setShowConfirmation(true);
  };

  const handleJoinChat = () => {
    setShowConfirmation(false);
    navigation.navigate('Chat', { 
      collectionPoint: selectedPoint,
      pointName: selectedPoint.name,
      pointManager: selectedPoint.manager
    });
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedPoint(null);
  };

  const goToLocation = (point) => {
    mapRef.current?.animateToRegion({
      latitude: point.coords.latitude,
      longitude: point.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
    setSearchQuery('');
    setSearchResults([]);
    setSelectedPoint(point);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
      
      {/* Navigation Controls */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.headerNav}>
          <Ionicons name="arrow-back" size={24} color={COLORS.surface} />
          <Text style={styles.headerNavText}>Home</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Green Points</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('PublicBinsMap')} style={styles.headerNavRight}>
          <Ionicons name="trash-bin" size={20} color={COLORS.warning} />
          <Text style={styles.headerNavTextRight}>Public Bins</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Notification Panel */}
      {notifVisible && (
        <View style={styles.notificationPanel}>
          <View style={styles.notifHeader}>
            <Ionicons name="notifications" size={20} color={COLORS.accent} style={{ marginRight: 6 }} />
            <Text style={styles.notifTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => setNotifVisible(false)} style={{ marginLeft: 'auto', padding: 4 }}>
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          {dummyNotifications.map(n => (
            <View key={n.id} style={styles.notifRow}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.accent} style={{ marginRight: 6 }} />
              <Text style={styles.notifText}>{n.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search by name, district, or waste type..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          inputStyle={styles.searchBarInput}
          searchIcon={{ color: COLORS.primaryDark }}
          clearIcon={{ color: COLORS.textMuted }}
          round
          lightTheme
        />
        
        {searchResults.length > 0 && (
          <ScrollView style={styles.searchResultsContainer}>
            {searchResults.map(point => (
              <TouchableOpacity 
                key={point.id} 
                style={styles.searchResultItem}
                onPress={() => goToLocation(point)}
              >
                <View>
                  <Text style={styles.searchResultTitle}>{point.name}</Text>
                  <Text style={styles.searchResultSubtitle}>{point.district}, {point.sector}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={rwandaRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {wastePoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coords}
            onPress={() => setSelectedPoint(point)}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="leaf" size={20} color={COLORS.surface} />
            </View>
          </Marker>
        ))}
      </MapView>
      
      {/* Selected Point Floating Card */}
      {selectedPoint && (
        <View style={styles.floatingCard}>
          <TouchableOpacity 
            style={styles.closeCardBtn} 
            onPress={() => setSelectedPoint(null)}
          >
            <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <View style={styles.iconBgResult}>
              <Ionicons name="business" size={24} color={COLORS.primaryDark} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle} numberOfLines={1}>{selectedPoint.name}</Text>
              <Text style={styles.cardSubtitle}>
                <Ionicons name="location" size={12} /> {selectedPoint.district}, {selectedPoint.sector}
              </Text>
            </View>
          </View>

          <View style={styles.cardBadges}>
            <View style={[styles.badge, { backgroundColor: '#ECFDF5' }]}>
               <Text style={[styles.badgeText, { color: COLORS.success }]}>{selectedPoint.status}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: '#FEFCE8' }]}>
               <Text style={[styles.badgeText, { color: COLORS.warning }]}>Cap: {selectedPoint.capacity}</Text>
            </View>
          </View>

          <View style={styles.cardDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} style={styles.detailIcon}/>
              <Text style={styles.detailText}>{selectedPoint.hours}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="person-outline" size={16} color={COLORS.textSecondary} style={styles.detailIcon}/>
              <Text style={styles.detailText}>Mgr: {selectedPoint.manager}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="call-outline" size={16} color={COLORS.textSecondary} style={styles.detailIcon}/>
              <Text style={styles.detailText}>{selectedPoint.contact}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="trash-bin-outline" size={16} color={COLORS.textSecondary} style={styles.detailIcon}/>
              <Text style={styles.detailText}>{selectedPoint.types.join(', ')}</Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, { flex: 1, marginRight: SIZES.s }]}
              onPress={() => setShowConfirmation(true)}
            >
              <Ionicons name="chatbubbles" size={18} color={COLORS.surface} style={{marginRight: 6}} />
              <Text style={styles.primaryButtonText}>Join Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.secondaryButton, { flex: 1 }]}
              onPress={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedPoint.coords.latitude},${selectedPoint.coords.longitude}`;
                Linking.openURL(url);
              }}
            >
              <Ionicons name="navigate" size={18} color={COLORS.primaryDark} style={{marginRight: 6}} />
              <Text style={styles.secondaryButtonText}>Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={[styles.iconBgResult, { width: 64, height: 64, borderRadius: 32 }]}>
                 <Ionicons name="chatbubbles" size={32} color={COLORS.primaryDark} />
              </View>
              <Text style={styles.modalTitle}>Join Chat Room</Text>
            </View>
            
            {selectedPoint && (
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  Connect directly with <Text style={{fontWeight: 'bold', color: COLORS.text}}>{selectedPoint.manager}</Text> at {selectedPoint.name}.
                </Text>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancel} onPress={handleCancel}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalJoin} onPress={handleJoinChat}>
                <Text style={styles.modalJoinText}>Join Now</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: SIZES.m,
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SIZES.m,
    zIndex: 10,
    ...SHADOWS.small,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.xs,
  },
  headerNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: SIZES.s,
  },
  headerNavText: {
    color: COLORS.surface,
    fontSize: SIZES.body1,
    fontWeight: '700',
    marginLeft: 6,
  },
  headerNavTextRight: {
    color: COLORS.warning,
    fontSize: SIZES.caption,
    fontWeight: '700',
    marginLeft: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: COLORS.surface,
    fontSize: SIZES.h3,
    fontWeight: '800',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  markerContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    borderColor: '#D1FAE5',
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  searchContainer: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    zIndex: 5,
    paddingHorizontal: SIZES.m,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
    padding: 0,
    ...SHADOWS.medium,
  },
  searchBarInputContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusPill,
    height: 50,
  },
  searchBarInput: {
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  searchResultsContainer: {
    backgroundColor: COLORS.surface,
    marginTop: SIZES.xs,
    maxHeight: 250,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.medium,
  },
  searchResultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  searchResultTitle: {
    fontWeight: '700',
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  searchResultSubtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption,
    marginTop: 2,
  },
  floatingCard: {
    position: 'absolute',
    bottom: 30,
    left: SIZES.m,
    right: SIZES.m,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.l,
    ...SHADOWS.large,
    zIndex: 10,
  },
  closeCardBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.s,
  },
  iconBgResult: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.m,
  },
  cardTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  cardBadges: {
    flexDirection: 'row',
    marginBottom: SIZES.m,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: SIZES.radiusPill,
    marginRight: SIZES.s,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  cardDetails: {
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    marginBottom: SIZES.m,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: COLORS.primaryDark,
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: SIZES.body2,
  },
  secondaryButton: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    borderRadius: SIZES.radiusPill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: COLORS.primaryDark,
    fontWeight: '700',
    fontSize: SIZES.body2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusXl,
    padding: SIZES.xl,
    width: '85%',
    alignItems: 'center',
    ...SHADOWS.large,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  modalTitle: {
    fontSize: SIZES.h3,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SIZES.m,
  },
  modalBody: {
    marginBottom: SIZES.l,
    alignItems: 'center',
  },
  modalText: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalFooter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: SIZES.m,
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radiusPill,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  modalCancelText: {
    color: COLORS.textSecondary,
    fontWeight: '700',
    fontSize: SIZES.body1,
  },
  modalJoin: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: SIZES.radiusPill,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
  },
  modalJoinText: {
    color: COLORS.surface,
    fontWeight: '700',
    fontSize: SIZES.body1,
  },
  notificationPanel: {
    position: 'absolute',
    top: 170,
    right: SIZES.m,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    width: 280,
    zIndex: 20,
    ...SHADOWS.large,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notifHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.s,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: SIZES.xs,
  },
  notifTitle: {
    fontWeight: '800',
    color: COLORS.text,
    fontSize: SIZES.body2,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.s,
  },
  notifText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.caption,
    flex: 1,
    lineHeight: 18,
  },
});

export default CollectionPoints;