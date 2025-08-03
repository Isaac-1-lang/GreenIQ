import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wastePoints } from './CollectionPoints';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

const LocationSelectionScreen = ({ navigation }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  const seoulRegion = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  };

  const confirmSelection = () => {
    if (!selectedPoint) return;
    navigation.navigate({
      name: 'Signup',
      params: { selectedLocation: selectedPoint.name },
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Location</Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={seoulRegion}
        >
          {wastePoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={point.coords}
              onPress={() => setSelectedPoint(point)}
            >
              <View style={[
                styles.markerContainer, 
                selectedPoint?.id === point.id && styles.selectedMarker
              ]}>
                <Ionicons 
                  name="business" 
                  size={20} 
                  color={selectedPoint?.id === point.id ? '#fff' : '#1b4332'} 
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
      {selectedPoint && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectedLocationName}>{selectedPoint.name}</Text>
          <Text style={styles.selectedLocationDetails}>
            {selectedPoint.district}, {selectedPoint.sector}
          </Text>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmSelection}
          >
            <Text style={styles.confirmButtonText}>Select This Location</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2d6a4f',
    backgroundColor: '#2d6a4f',
    paddingTop: Platform.OS === 'android' ? 25 : 15,
    zIndex: 1,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1b4332',
    borderWidth: 2,
  },
  selectedMarker: {
    backgroundColor: '#2d6a4f',
    borderColor: '#fff',
  },
  selectionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2d6a4f',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  selectedLocationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  selectedLocationDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#2d6a4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationSelectionScreen; 