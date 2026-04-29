import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, TextInput, StatusBar, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const PublicBinsMap = ({ navigation }) => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedBin, setSelectedBin] = useState(null);
  const [filterType, setFilterType] = useState('All');
  const [gpsEnabled, setGpsEnabled] = useState(false);

  // Public bins data for Kigali
  const publicBins = [
    {
      id: '1',
      name: 'Kigali City Market Central Bin',
      type: 'Mixed Waste',
      coords: { latitude: -1.9536, longitude: 30.0606 },
      address: 'KN 4 Ave, Nyarugenge',
      capacity: 85,
      status: 'Nearly Full',
      acceptedWaste: ['General waste', 'Non-recyclables', 'Food packaging'],
      lastEmptied: '2 hours ago',
    },
    {
      id: '2',
      name: 'Kimironko Market Recycling Station',
      type: 'Recyclables',
      coords: { latitude: -1.9447, longitude: 30.1188 },
      address: 'KG 7 Ave, Gasabo',
      capacity: 45,
      status: 'Available',
      acceptedWaste: ['Plastic bottles', 'Paper', 'Cardboard', 'Metal cans'],
      lastEmptied: '1 day ago',
    },
    {
      id: '3',
      name: 'Nyamirambo Organic Waste Bin',
      type: 'Organic',
      coords: { latitude: -1.9789, longitude: 30.0445 },
      address: 'KN 70 St, Nyarugenge',
      capacity: 30,
      status: 'Available',
      acceptedWaste: ['Food scraps', 'Garden waste', 'Compostable materials'],
      lastEmptied: '6 hours ago',
    },
    {
      id: '4',
      name: 'Kicukiro E-Waste Collection Point',
      type: 'E-Waste',
      coords: { latitude: -1.9892, longitude: 30.1047 },
      address: 'KK 15 Rd, Kicukiro',
      capacity: 60,
      status: 'Available',
      acceptedWaste: ['Electronics', 'Batteries', 'Cables', 'Small appliances'],
      lastEmptied: '3 days ago',
    },
    {
      id: '5',
      name: 'Remera Mixed Waste Station',
      type: 'Mixed Waste',
      coords: { latitude: -1.9536, longitude: 30.0909 },
      address: 'KN 3 Ave, Gasabo',
      capacity: 70,
      status: 'Available',
      acceptedWaste: ['General waste', 'Non-recyclables'],
      lastEmptied: '5 hours ago',
    },
    {
      id: '6',
      name: 'Gikondo Industrial Waste Bin',
      type: 'Industrial',
      coords: { latitude: -2.0089, longitude: 30.0589 },
      address: 'KK 7 Ave, Kicukiro',
      capacity: 90,
      status: 'Nearly Full',
      acceptedWaste: ['Industrial packaging', 'Construction debris', 'Metal scraps'],
      lastEmptied: '1 hour ago',
    },
    {
      id: '7',
      name: 'Kacyiru Recycling Hub',
      type: 'Recyclables',
      coords: { latitude: -1.9403, longitude: 30.0939 },
      address: 'KG 9 Ave, Gasabo',
      capacity: 25,
      status: 'Available',
      acceptedWaste: ['Plastic', 'Glass', 'Paper', 'Aluminum'],
      lastEmptied: '12 hours ago',
    },
    {
      id: '8',
      name: 'Nyabugogo Organic Compost Bin',
      type: 'Organic',
      coords: { latitude: -1.9647, longitude: 30.0547 },
      address: 'KN 2 Rd, Nyarugenge',
      capacity: 40,
      status: 'Available',
      acceptedWaste: ['Food waste', 'Yard trimmings', 'Biodegradable materials'],
      lastEmptied: '8 hours ago',
    },
  ];

  const binTypes = ['All', 'Mixed Waste', 'Recyclables', 'Organic', 'E-Waste', 'Industrial'];

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setGpsEnabled(true);
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const kigaliRegion = {
    latitude: -1.9536,
    longitude: 30.0606,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  };

  const filteredBins = publicBins.filter(bin => {
    const matchesType = filterType === 'All' || bin.type === filterType;
    const matchesSearch = search.trim().length === 0 || 
      bin.name.toLowerCase().includes(search.toLowerCase()) || 
      bin.address.toLowerCase().includes(search.toLowerCase()) ||
      bin.type.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getBinColor = (type) => {
    switch (type) {
      case 'Mixed Waste': return '#64748B';
      case 'Recyclables': return '#3B82F6';
      case 'Organic': return '#10B981';
      case 'E-Waste': return '#F59E0B';
      case 'Industrial': return '#EF4444';
      default: return '#64748B';
    }
  };

  const getBinIcon = (type) => {
    switch (type) {
      case 'Mixed Waste': return 'trash-bin';
      case 'Recyclables': return 'leaf';
      case 'Organic': return 'nutrition';
      case 'E-Waste': return 'hardware-chip';
      case 'Industrial': return 'construct';
      default: return 'trash-bin';
    }
  };

  const handleReportFull = (bin) => {
    Alert.alert(
      'Report Bin Status',
      `Report "${bin.name}" as full?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Report',
          onPress: () => {
            Alert.alert('Thank You!', 'Your report has been submitted. The collection team will be notified.');
            setSelectedBin(null);
          },
        },
      ]
    );
  };

  const availableBins = filteredBins.filter(b => b.status === 'Available').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerNav}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          <Text style={styles.headerNavText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Public Bins</Text>
        </View>

        <TouchableOpacity 
          onPress={() => {
            if (userLocation && mapRef.current) {
              mapRef.current.animateToRegion({
                ...userLocation,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              });
            }
          }} 
          style={styles.headerNavRight}
        >
          <Ionicons name="locate" size={20} color="#10B981" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search bins by location or type..."
            style={styles.searchInput}
            placeholderTextColor="#94A3B8"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {binTypes.map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setFilterType(type)}
              style={[
                styles.filterChip,
                filterType === type && styles.filterChipActive,
                { borderColor: type === 'All' ? '#0F766E' : getBinColor(type) }
              ]}
            >
              <Text style={[
                styles.filterChipText,
                filterType === type && styles.filterChipTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Map */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={kigaliRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {filteredBins.map((bin) => (
          <Marker
            key={bin.id}
            coordinate={bin.coords}
            onPress={() => setSelectedBin(bin)}
          >
            <View style={[styles.markerOutline, { backgroundColor: `${getBinColor(bin.type)}20` }]}>
              <View style={[styles.markerInner, { backgroundColor: getBinColor(bin.type) }]}>
                <Ionicons name={getBinIcon(bin.type)} size={18} color="#FFFFFF" />
              </View>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Stats Footer */}
      <View style={styles.statsFooter}>
        <View style={styles.statItem}>
          <Ionicons name="trash-bin" size={18} color="#0F766E" />
          <Text style={styles.statValue}>{filteredBins.length}</Text>
          <Text style={styles.statLabel}>Found</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="checkmark-circle" size={18} color="#10B981" />
          <Text style={styles.statValue}>{availableBins}</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="navigate" size={18} color={gpsEnabled ? '#10B981' : '#94A3B8'} />
          <Text style={styles.statValue}>{gpsEnabled ? 'ON' : 'OFF'}</Text>
          <Text style={styles.statLabel}>GPS</Text>
        </View>
      </View>

      {/* Bin Details Card */}
      {selectedBin && (
        <View style={styles.floatingCard}>
          <TouchableOpacity 
            style={styles.closeCardBtn} 
            onPress={() => setSelectedBin(null)}
          >
            <Ionicons name="close-circle" size={28} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.cardHeader}>
            <View style={[styles.iconBgResult, { backgroundColor: `${getBinColor(selectedBin.type)}15` }]}>
              <Ionicons name={getBinIcon(selectedBin.type)} size={24} color={getBinColor(selectedBin.type)} />
            </View>
            <View style={{flex: 1}}>
              <Text style={styles.cardTitle} numberOfLines={1}>{selectedBin.name}</Text>
              <Text style={styles.cardSubtitle}>
                <Ionicons name="location" size={12} /> {selectedBin.address}
              </Text>
            </View>
          </View>

          {/* Bin Type Badge */}
          <View style={[styles.typeBadge, { backgroundColor: `${getBinColor(selectedBin.type)}15` }]}>
            <Text style={[styles.typeBadgeText, { color: getBinColor(selectedBin.type) }]}>
              {selectedBin.type}
            </Text>
          </View>

          {/* Capacity Bar */}
          <View style={styles.capacitySection}>
            <View style={styles.capacityHeader}>
              <Text style={styles.capacityLabel}>Capacity</Text>
              <Text style={[
                styles.capacityValue,
                { color: selectedBin.capacity > 80 ? '#EF4444' : '#10B981' }
              ]}>
                {selectedBin.capacity}%
              </Text>
            </View>
            <View style={styles.capacityBarBg}>
              <View 
                style={[
                  styles.capacityBarFill, 
                  { 
                    width: `${selectedBin.capacity}%`,
                    backgroundColor: selectedBin.capacity > 80 ? '#EF4444' : '#10B981'
                  }
                ]} 
              />
            </View>
            <Text style={styles.statusText}>
              Status: <Text style={{ 
                fontWeight: '700',
                color: selectedBin.status === 'Available' ? '#10B981' : '#F59E0B'
              }}>
                {selectedBin.status}
              </Text>
            </Text>
          </View>

          {/* Accepted Waste */}
          <View style={styles.wasteSection}>
            <Text style={styles.wasteSectionTitle}>Accepted Waste Types:</Text>
            <View style={styles.wasteChips}>
              {selectedBin.acceptedWaste.map((waste, idx) => (
                <View key={idx} style={styles.wasteChip}>
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                  <Text style={styles.wasteChipText}>{waste}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Last Emptied */}
          <Text style={styles.lastEmptiedText}>
            <Ionicons name="time-outline" size={14} /> Last emptied: {selectedBin.lastEmptied}
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={[styles.primaryButton, { flex: 1, marginRight: 8 }]}
              onPress={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedBin.coords.latitude},${selectedBin.coords.longitude}`;
                Linking.openURL(url);
              }}
            >
              <Ionicons name="navigate" size={18} color="#FFFFFF" style={{marginRight: 6}} />
              <Text style={styles.primaryButtonText}>Get Directions</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => handleReportFull(selectedBin)}
            >
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#0F766E',
    paddingHorizontal: 16,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  headerNavRight: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerNavText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 6,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 110,
    left: 16,
    right: 16,
    zIndex: 5,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },
  filterContainer: {
    position: 'absolute',
    top: 170,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  filterScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterChipActive: {
    backgroundColor: '#0F766E',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  markerOutline: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerInner: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statsFooter: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  floatingCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 10,
  },
  closeCardBtn: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBgResult: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  capacitySection: {
    marginBottom: 12,
  },
  capacityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  capacityLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  capacityValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  capacityBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 6,
  },
  capacityBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  wasteSection: {
    marginBottom: 12,
  },
  wasteSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  wasteChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  wasteChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 6,
  },
  wasteChipText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '600',
    marginLeft: 4,
  },
  lastEmptiedText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#0F766E',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PublicBinsMap;
