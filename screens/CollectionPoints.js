import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Modal, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export const wastePoints = [
  { id: 1, name: 'Mapo Resource Recovery Facility', district: 'Mapo-gu', sector: 'Seoul', coords: { latitude: 37.5665, longitude: 126.9780 }, types: ['Recyclable wastes', 'Plastic', 'Paper', 'Metal', 'Glass'], hours: 'Mon-Sat: 7:00 AM - 6:00 PM', contact: '+82 2 1234 5678', capacity: 'High', status: 'Operational', description: 'Major resource recovery facility in Seoul for comprehensive waste processing.', manager: 'Kim Min-seok' },
  { id: 2, name: 'Future Sangdam-dong Incineration Plant', district: 'Gangdong-gu', sector: 'Seoul', coords: { latitude: 37.5492, longitude: 127.1465 }, types: ['Non biodegradable', 'Hazardous', 'Organic'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 2345 6789', capacity: 'High', status: 'Operational', description: 'Advanced incineration facility for non-recyclable waste processing.', manager: 'Park Ji-hyun' },
  { id: 3, name: 'Nowon Facility', district: 'Nowon-gu', sector: 'Seoul', coords: { latitude: 37.6542, longitude: 127.0568 }, types: ['Organic', 'Plastic', 'Paper', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+82 2 3456 7890', capacity: 'Medium', status: 'Operational', description: 'Multi-purpose waste processing facility serving northern Seoul.', manager: 'Lee Seung-ho' },
  { id: 4, name: 'Gangnam Recycling Center', district: 'Gangnam-gu', sector: 'Seoul', coords: { latitude: 37.5172, longitude: 127.0473 }, types: ['Paper', 'Glass', 'Electronic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 4567 8901', capacity: 'Medium', status: 'Operational', description: 'Premium recycling center for high-value materials.', manager: 'Choi Yoon-jung' },
  { id: 5, name: 'Seongbuk Waste Station', district: 'Seongbuk-gu', sector: 'Seoul', coords: { latitude: 37.5894, longitude: 127.0167 }, types: ['Organic', 'Metal'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+82 2 5678 9012', capacity: 'Low', status: 'Operational', description: 'Local waste station for organic and metal processing.', manager: 'Jung Min-kyu' },
  { id: 6, name: 'Dongdaemun Collection Point', district: 'Dongdaemun-gu', sector: 'Seoul', coords: { latitude: 37.5744, longitude: 127.0095 }, types: ['Plastic', 'Glass', 'Textile'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+82 2 6789 0123', capacity: 'Low', status: 'Limited', description: 'Collection point near Dongdaemun market for commercial waste.', manager: 'Han Soo-jin' },
  { id: 7, name: 'Yongsan Recycling Hub', district: 'Yongsan-gu', sector: 'Seoul', coords: { latitude: 37.5320, longitude: 126.9904 }, types: ['Paper', 'Textile', 'Electronic'], hours: 'Mon-Sat: 7:30 AM - 5:30 PM', contact: '+82 2 7890 1234', capacity: 'Medium', status: 'Operational', description: 'Eco-friendly center for paper, textile, and e-waste recycling.', manager: 'Kang Dong-wook' },
  { id: 8, name: 'Jongno Waste Depot', district: 'Jongno-gu', sector: 'Seoul', coords: { latitude: 37.5736, longitude: 126.9784 }, types: ['Organic', 'Metal'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+82 2 8901 2345', capacity: 'Low', status: 'Operational', description: 'Historic district waste depot for organic and metal waste.', manager: 'Yoon Ji-eun' },
  { id: 9, name: 'Eunpyeong Collection', district: 'Eunpyeong-gu', sector: 'Seoul', coords: { latitude: 37.6186, longitude: 126.9270 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+82 2 9012 3456', capacity: 'Medium', status: 'Operational', description: 'Western Seoul collection point for organic and plastic waste.', manager: 'Kim Tae-ho' },
  { id: 10, name: 'Gangseo Waste Point', district: 'Gangseo-gu', sector: 'Seoul', coords: { latitude: 37.5519, longitude: 126.8495 }, types: ['Paper', 'Glass'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+82 2 0123 4567', capacity: 'Low', status: 'Operational', description: 'Western Seoul recycling point for paper and glass waste.', manager: 'Park Min-ji' },
  { id: 11, name: 'Yangcheon Recycling', district: 'Yangcheon-gu', sector: 'Seoul', coords: { latitude: 37.5270, longitude: 126.8562 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 1234 5678', capacity: 'Medium', status: 'Operational', description: 'Textile and organic waste recycling center.', manager: 'Lee Ji-hye' },
  { id: 12, name: 'Guro Waste Station', district: 'Guro-gu', sector: 'Seoul', coords: { latitude: 37.4954, longitude: 126.8874 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+82 2 2345 6789', capacity: 'Low', status: 'Operational', description: 'Industrial district station for plastic and metal waste.', manager: 'Choi Seung-min' },
  { id: 13, name: 'Geumcheon Collection', district: 'Geumcheon-gu', sector: 'Seoul', coords: { latitude: 37.4519, longitude: 126.9020 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 3456 7890', capacity: 'Medium', status: 'Operational', description: 'Collection point for organic and paper waste.', manager: 'Jung Hye-ri' },
  { id: 14, name: 'Yeongdeungpo Waste Point', district: 'Yeongdeungpo-gu', sector: 'Seoul', coords: { latitude: 37.5264, longitude: 126.8962 }, types: ['Plastic', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+82 2 4567 8901', capacity: 'Low', status: 'Operational', description: 'E-waste and plastic collection in Yeongdeungpo.', manager: 'Han Min-seok' },
  { id: 15, name: 'Gwangjin Recycling', district: 'Gwangjin-gu', sector: 'Seoul', coords: { latitude: 37.5384, longitude: 127.0822 }, types: ['Organic', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:00 PM', contact: '+82 2 5678 9012', capacity: 'Medium', status: 'Operational', description: 'Eastern Seoul center for organic and textile waste.', manager: 'Kang Soo-jin' },
  { id: 16, name: 'Seongdong Waste Depot', district: 'Seongdong-gu', sector: 'Seoul', coords: { latitude: 37.5506, longitude: 127.0409 }, types: ['Metal', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+82 2 6789 0123', capacity: 'Low', status: 'Operational', description: 'Depot for metal and paper recycling.', manager: 'Yoon Dong-hyun' },
  { id: 17, name: 'Dongjak Collection', district: 'Dongjak-gu', sector: 'Seoul', coords: { latitude: 37.5124, longitude: 126.9393 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+82 2 7890 1234', capacity: 'Medium', status: 'Operational', description: 'Southern Seoul collection point for organic and plastic waste.', manager: 'Kim Ji-yoon' },
  { id: 18, name: 'Gwanak Waste Point', district: 'Gwanak-gu', sector: 'Seoul', coords: { latitude: 37.4784, longitude: 126.9516 }, types: ['Glass', 'Paper'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+82 2 8901 2345', capacity: 'Low', status: 'Operational', description: 'Southern point for glass and paper waste.', manager: 'Park Ji-hye' },
  { id: 19, name: 'Seocho Recycling', district: 'Seocho-gu', sector: 'Seoul', coords: { latitude: 37.4837, longitude: 127.0324 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 9012 3456', capacity: 'Medium', status: 'Operational', description: 'Recycling center for organic and textile waste.', manager: 'Lee Min-kyu' },
  { id: 20, name: 'Songpa Waste Station', district: 'Songpa-gu', sector: 'Seoul', coords: { latitude: 37.5145, longitude: 127.1059 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+82 2 0123 4567', capacity: 'Medium', status: 'Operational', description: 'Station for plastic and metal waste in eastern Seoul.', manager: 'Choi Ji-eun' },
  { id: 21, name: 'Gangdong Collection', district: 'Gangdong-gu', sector: 'Seoul', coords: { latitude: 37.5301, longitude: 127.1238 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 2 1234 5678', capacity: 'Low', status: 'Operational', description: 'Collection point for organic and paper waste.', manager: 'Jung Seung-ho' },
  { id: 22, name: 'Jungnang Waste Point', district: 'Jungnang-gu', sector: 'Seoul', coords: { latitude: 37.6066, longitude: 127.0926 }, types: ['Plastic', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+82 2 2345 6789', capacity: 'Low', status: 'Operational', description: 'E-waste and plastic collection in northeastern Seoul.', manager: 'Han Tae-ho' },
  { id: 23, name: 'Dobong Recycling', district: 'Dobong-gu', sector: 'Seoul', coords: { latitude: 37.6688, longitude: 127.0471 }, types: ['Organic', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:00 PM', contact: '+82 2 3456 7890', capacity: 'Medium', status: 'Operational', description: 'Northern Seoul center for organic and textile waste.', manager: 'Kang Min-ji' },
  { id: 24, name: 'No-won Waste Depot', district: 'No-won-gu', sector: 'Seoul', coords: { latitude: 37.6542, longitude: 127.0568 }, types: ['Metal', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+82 2 4567 8901', capacity: 'Low', status: 'Operational', description: 'Depot for metal and paper recycling.', manager: 'Yoon Ji-hye' },
  { id: 25, name: 'Uijeongbu Collection', district: 'Uijeongbu', sector: 'Gyeonggi', coords: { latitude: 37.7485, longitude: 127.0389 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+82 31 5678 9012', capacity: 'Medium', status: 'Operational', description: 'Collection point for organic and plastic waste in Gyeonggi province.', manager: 'Kim Dong-wook' },
  { id: 26, name: 'Suwon Waste Point', district: 'Suwon', sector: 'Gyeonggi', coords: { latitude: 37.2636, longitude: 127.0286 }, types: ['Glass', 'Paper'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+82 31 6789 0123', capacity: 'Low', status: 'Operational', description: 'Collection point for glass and paper waste in Suwon.', manager: 'Park Min-kyu' },
  { id: 27, name: 'Incheon Recycling', district: 'Incheon', sector: 'Incheon', coords: { latitude: 37.4563, longitude: 126.7052 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 32 7890 1234', capacity: 'Medium', status: 'Operational', description: 'Recycling center for organic and textile waste in Incheon.', manager: 'Lee Ji-eun' },
  { id: 28, name: 'Bundang Waste Station', district: 'Bundang', sector: 'Gyeonggi', coords: { latitude: 37.3594, longitude: 127.1086 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+82 31 8901 2345', capacity: 'Medium', status: 'Operational', description: 'Station for plastic and metal waste in Bundang.', manager: 'Choi Seung-min' },
  { id: 29, name: 'Yongin Collection', district: 'Yongin', sector: 'Gyeonggi', coords: { latitude: 37.2411, longitude: 127.1776 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+82 31 9012 3456', capacity: 'Medium', status: 'Operational', description: 'Collection point for organic and paper waste in Yongin.', manager: 'Jung Hye-ri' },
  { id: 30, name: 'Bucheon Waste Depot', district: 'Bucheon', sector: 'Gyeonggi', coords: { latitude: 37.5035, longitude: 126.7660 }, types: ['Metal', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+82 32 0123 4567', capacity: 'Low', status: 'Operational', description: 'Depot for metal and plastic waste in Bucheon.', manager: 'Han Min-seok' },
];

const RwandaMap = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const dummyNotifications = [
    { id: 1, text: 'Heavy rainfall expected in Gasabo. Safe zones open for shelter.' },
    { id: 2, text: 'Flood risk near Nyarugenge Waste Hub. Use alternate safe zone.' },
    { id: 3, text: 'Heatwave alert: Stay hydrated and visit safe zones for cooling.' },
  ];

  const seoulCenter = { latitude: 37.5665, longitude: 126.9780 };
  const seoulRegion = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  };

  // Request location permissions
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

  // Search functionality
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
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Navigation Controls */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 44, paddingBottom: 10, backgroundColor: '#1B5E20', paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ padding: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 6 }}>Home</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 }}>Collection Points</Text>
        <TouchableOpacity onPress={() => navigation.navigate('SafeZonesMap')} style={{ padding: 6, flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="shield-outline" size={22} color="#FFD700" />
          <Text style={{ color: '#FFD700', fontSize: 15, fontWeight: 'bold', marginLeft: 4 }}>Safe Zones</Text>
        </TouchableOpacity>
      </View>
      {/* Floating Notification Panel */}
      {notifVisible && (
        <View style={{ position: 'absolute', top: 80, right: 18, backgroundColor: '#fff', borderRadius: 14, elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, width: 280, zIndex: 20, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="notifications" size={20} color="#FF5722" style={{ marginRight: 6 }} />
            <Text style={{ fontWeight: 'bold', color: '#1B5E20', fontSize: 15 }}>Notifications</Text>
            <TouchableOpacity onPress={() => setNotifVisible(false)} style={{ marginLeft: 'auto', padding: 4 }}>
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          </View>
          {dummyNotifications.map(n => (
            <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF5722" style={{ marginRight: 6 }} />
              <Text style={{ color: '#333', fontSize: 13 }}>{n.text}</Text>
            </View>
          ))}
        </View>
      )}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={seoulRegion}
        mapType="standard"
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {wastePoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coords}
            title={point.name}
            description={point.description}
            onPress={() => handleMarkerClick(point)}
          >
            {/* Distinct Safe Zone Marker */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0f7fa', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#00C896',
              }}>
                <Ionicons name="shield" size={22} color="#1B5E20" />
              </View>
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{point.name} <Text style={{ color: '#00C896', fontWeight: 'bold' }}>[Safe Zone]</Text></Text>
                <Text style={styles.calloutDescription}>{point.description}</Text>
                <Text style={styles.calloutText}>District: {point.district}</Text>
                <Text style={styles.calloutText}>Sector: {point.sector}</Text>
                <Text style={styles.calloutText}>Waste Types: {point.types.join(', ')}</Text>
                <Text style={styles.calloutText}>Hours: {point.hours}</Text>
                <Text style={styles.calloutText}>Contact: {point.contact}</Text>
                <TouchableOpacity 
                  style={[styles.joinChatButton, { backgroundColor: '#00C896', marginBottom: 6 }]}
                  onPress={() => handleMarkerClick(point)}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text style={styles.joinChatText}>Join Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.joinChatButton, { backgroundColor: '#1B5E20' }]}
                  onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.coords.latitude},${point.coords.longitude}`;
                    Linking.openURL(url);
                  }}
                >
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.joinChatText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
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
              <Ionicons name="chatbubble-ellipses" size={32} color="#2d6a4f" />
              <Text style={styles.modalTitle}>Join Chat Room</Text>
            </View>
            
            {selectedPoint && (
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  Would you like to join the chat room for {selectedPoint.name}?
                </Text>
                <Text style={styles.modalSubText}>
                  You'll be able to chat with the collection point manager and other users.
                </Text>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Manager: </Text>
                    {selectedPoint.manager}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Location: </Text>
                    {selectedPoint.district}, {selectedPoint.sector}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.joinButton]} 
                onPress={handleJoinChat}
              >
                <Text style={styles.joinButtonText}>Join Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search waste points..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
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
                <Text style={styles.searchResultTitle}>{point.name}</Text>
                <Text style={styles.searchResultSubtitle}>{point.district}, {point.sector}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      
      {selectedPoint && (
        <View style={styles.selectedPointContainer}>
          <View style={styles.selectedPointContent}>
            <View style={styles.selectedPointHeader}>
              <Text style={styles.selectedPointTitle}>{selectedPoint.name}</Text>
              <TouchableOpacity 
                style={styles.joinChatButton}
                onPress={() => setShowConfirmation(true)}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                <Text style={styles.joinChatText}>Join Chat</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectedPointDetails}>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Manager: </Text>
                {selectedPoint.manager}
              </Text>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Location: </Text>
                {selectedPoint.district}, {selectedPoint.sector}
              </Text>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Hours: </Text>
                {selectedPoint.hours}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginHorizontal: 10,
  },
  searchBarInputContainer: {
    backgroundColor: '#FFF',
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    maxHeight: 200,
    borderRadius: 10,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchResultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d6a4f',
  },
  searchResultSubtitle: {
    color: '#6c6c6c',
    fontSize: 14,
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6c6c6c',
  },
  markerContainer: {
    backgroundColor: '#ff6a4f',
    padding: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerInner: {
    backgroundColor: '#ff6a4f',
    width: 24,
    height: 24,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d6a4f',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#6c6c6c',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 10,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfo: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalInfoLabel: {
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#2d6a4f',
  },
  joinButton: {
    backgroundColor: '#2d6a4f',
  },
  cancelButtonText: {
    color: '#2d6a4f',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedPointContainer: {
    position: 'absolute',
    top: 120,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedPointContent: {
    flex: 1,
  },
  selectedPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedPointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    flex: 1,
  },
  joinChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d6a4f',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinChatText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
  },
  selectedPointDetails: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  selectedPointText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  selectedPointLabel: {
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
});

export default RwandaMap;