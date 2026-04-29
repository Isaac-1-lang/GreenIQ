import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Linking, TextInput, StatusBar } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const SafeZonesMap = ({ navigation }) => {
  const mapRef = useRef(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);
  
  const { dummySafeZones } = require('../utils/dummyData');
  const [safeZones] = useState(dummySafeZones);

  const alerts = [
    { id: 1, text: 'Heavy rainfall expected in Gasabo. Safe zones open for shelter.' },
    { id: 2, text: 'Flood risk near Nyarugenge. Use alternate safe zone.' },
    { id: 3, text: 'Heatwave alert: Stay hydrated and visit safe zones for cooling.' },
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const rwandaRegion = {
    latitude: -1.9403,
    longitude: 30.0739,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  const filteredZones = search.trim().length > 0
    ? safeZones.filter(z => z.name.toLowerCase().includes(search.toLowerCase()) || z.address.toLowerCase().includes(search.toLowerCase()))
    : safeZones;

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
          <Text style={styles.headerTitle}>Safe Zones</Text>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('Map')} style={styles.headerNavRight}>
          <Ionicons name="map" size={20} color={COLORS.accent} />
          <Text style={styles.headerNavTextRight}>Collection</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Notification Panel */}
      {notifVisible && (
        <View style={styles.notificationPanel}>
          <View style={styles.notifHeader}>
            <Ionicons name="notifications" size={20} color={COLORS.accent} style={{ marginRight: 6 }} />
            <Text style={styles.notifTitle}>Safety Alerts</Text>
            <TouchableOpacity onPress={() => setNotifVisible(false)} style={{ marginLeft: 'auto', padding: 4 }}>
              <Ionicons name="close" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          {alerts.map(n => (
            <View key={n.id} style={styles.notifRow}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} style={{ marginRight: 6 }} />
              <Text style={styles.notifText}>{n.text}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Search Bar Floating Top */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Find a safe shelter area..."
            style={styles.searchInput}
            placeholderTextColor={COLORS.textMuted}
          />
          {search.length > 0 && (
             <TouchableOpacity onPress={() => setSearch('')}>
               <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
             </TouchableOpacity>
          )}
        </View>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={rwandaRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredZones.map((zone) => (
          <Marker
            key={zone.id}
            coordinate={zone.coords}
            onPress={() => setSelectedZone(zone)}
          >
            <View style={styles.markerOutline}>
              <View style={styles.markerInner}>
                <Ionicons name="shield-half" size={18} color={COLORS.surface} />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Bottom Floating Sheet equivalent for Safe Zones */}
      {selectedZone && (
        <View style={styles.floatingCard}>
          <TouchableOpacity 
            style={styles.closeCardBtn} 
            onPress={() => setSelectedZone(null)}
          >
            <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <View style={styles.iconBgResult}>
              <Ionicons name="shield-checkmark" size={24} color={COLORS.primaryDark} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle} numberOfLines={1}>{selectedZone.name}</Text>
              <Text style={styles.cardSubtitle}>
                <Ionicons name="location" size={12} /> {selectedZone.address}
              </Text>
            </View>
          </View>

          <View style={styles.cardDetails}>
             <Ionicons name="information-circle-outline" size={20} color={COLORS.primaryDark} style={{marginTop: 2, marginRight: 8}}/>
             <Text style={styles.cardDescText}>{selectedZone.description}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, { flex: 1 }]}
              onPress={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedZone.coords.latitude},${selectedZone.coords.longitude}`;
                Linking.openURL(url);
              }}
            >
              <Ionicons name="navigate" size={18} color={COLORS.surface} style={{marginRight: 6}} />
              <Text style={styles.primaryButtonText}>Get Fast Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: COLORS.accent,
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
  searchContainer: {
    position: 'absolute',
    top: 110,
    left: SIZES.m,
    right: SIZES.m,
    zIndex: 5,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusPill,
    paddingHorizontal: SIZES.l,
    height: 50,
    ...SHADOWS.medium,
  },
  searchIcon: {
    marginRight: SIZES.s,
  },
  searchInput: {
    flex: 1,
    fontSize: SIZES.body1,
    color: COLORS.text,
  },
  markerOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 118, 110, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  markerInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
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
    marginBottom: SIZES.m,
  },
  iconBgResult: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ECFDF5',
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
  cardDetails: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: SIZES.radiusLg,
    padding: SIZES.m,
    marginBottom: SIZES.m,
  },
  cardDescText: {
    fontSize: SIZES.body2,
    color: COLORS.textSecondary,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
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

export default SafeZonesMap;