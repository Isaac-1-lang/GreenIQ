import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, Alert, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import WasteClassificationModal from '../components/WasteClassificationModal';
import { useNavigation } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;

const wasteControlTips = [
  'Reduce: Buy only what you need and avoid single-use products.',
  'Reuse: Find new uses for items instead of throwing them away.',
  'Recycle: Sort your waste and recycle whenever possible.',
  'Compost: Compost food scraps and biodegradable waste.',
  'Educate: Share knowledge about waste management with others.',
  'Participate: Join local clean-up or recycling programs.',
];

const ScanScreen = () => {
  const navigation = useNavigation();
  const [photos, setPhotos] = useState([]); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [classificationResults, setClassificationResults] = useState([]);
  const [showFallback, setShowFallback] = useState(false);
  const [fallbackFact, setFallbackFact] = useState('');

  const SERVER_URL = 'http://192.168.0.105:10000';
  const SERVER_URL_1 = 'https://waste-classifier-modal-6.onrender.com';

  // Using dummy classification results
  const dummyClassificationResult = {
    label: 'biodegradable',
    confidence: 0.92,
    description: 'This type of waste breaks down naturally and is good for composting.',
    recyclable: false,
    disposal: 'Use compost or organic bin',
    example_items: ['banana peel', 'food waste', 'paper'],
  };

  const ecoFacts = [
    'Recycling one aluminum can saves enough energy to run a TV for 3 hours.',
    'Plastic can take up to 1,000 years to decompose in landfills.',
    'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
    'Glass is 100% recyclable and can be recycled endlessly.',
    'Composting food waste reduces methane emissions from landfills.'
  ];

  const handlePickImage = async () => {
    if (photos.length >= 4) {
      Alert.alert('Limit reached', 'You can only select up to 4 images.');
      return;
    }
    
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please grant media library access to pick images.');
        return;
      }
      
      setIsProcessing(true);
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false, 
        quality: 0.8,
        allowsEditing: false,
        exif: false, 
      });
      
      setIsProcessing(false);
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        console.log('Selected image asset:', {
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileSize: asset.fileSize,
          fileName: asset.fileName,
          type: asset.type
        });
        
        if (!asset.uri) {
          Alert.alert('Error', 'Invalid image selected');
          return;
        }
        
        if (!asset.uri.startsWith('file://') && !asset.uri.startsWith('content://')) {
          Alert.alert('Error', 'Invalid image URI format');
          return;
        }
        
        const photoObj = {
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.type || 'image/jpeg'
        };
        
        setPhotos(prev => [...prev, photoObj]);
      }
    } catch (e) {
      setIsProcessing(false);
      Alert.alert('Error', `Image picker failed: ${e.message}`);
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      Alert.alert('No Images', 'Please select at least one image to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload with dummy data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const photo = photos[0];
      const result = {
        ...dummyClassificationResult,
        image: photo.uri,
      };
      
      setUploading(false);
      setUploadProgress(100);
      navigation.navigate('ClassificationResult', { result });
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      Alert.alert('Upload Error', 'Failed to classify image. Please try again.');
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setPhotos([]);
    setConfirmed(false);
    setClassificationResults([]);
    setUploadProgress(0);
    Alert.alert('EcoPoints Earned!', 'You have earned EcoPoints for classifying your waste!');
  };

  const handleModalClose = () => {
    setShowModal(false);
    setConfirmed(false);
    setUploadProgress(0);
  };

  const handleClaimEcoPoints = () => {
    Alert.alert('EcoPoints Claimed!', 'You have claimed your EcoPoints!');
    setShowFallback(false);
    setPhotos([]);
    setConfirmed(false);
    setUploadProgress(0);
  };

  const resetScreen = () => {
    setPhotos([]);
    setConfirmed(false);
    setUploading(false);
    setUploadProgress(0);
    setShowModal(false);
    setClassificationResults([]);
    setShowFallback(false);
    setFallbackFact('');
  };

  if (showFallback) {
    const fallbackLabels = [
      {
        label: 'Biodegradable',
        description: 'This type of waste breaks down naturally and is good for composting. Composting biodegradable waste returns nutrients to the soil and reduces landfill use.'
      },
      {
        label: 'Non-biodegradable',
        description: 'This type of waste does not break down easily. It should be recycled or disposed of carefully to protect the environment.'
      }
    ];
    
    return (
      <ScrollView contentContainerStyle={styles.center}>
        <Ionicons name="leaf" size={60} color="#2d6a4f" style={{ marginBottom: 16 }} />
        <Text style={styles.fallbackTitle}>Scan Complete!</Text>
        <Text style={styles.fallbackSubtitle}>
          Here are some tips and facts for your waste items:
        </Text>
        {photos.map((photo, idx) => {
          const labelInfo = fallbackLabels[idx % 2];
          const fact = ecoFacts[(idx + Math.floor(Math.random() * ecoFacts.length)) % ecoFacts.length];
          return (
            <View key={photo.uri} style={styles.fallbackCard}>
              <Image source={{ uri: photo.uri }} style={styles.fallbackImage} />
              <Text style={styles.fallbackLabel}>{labelInfo.label}</Text>
              <Text style={styles.fallbackDesc}>{labelInfo.description}</Text>
              <Text style={styles.fallbackFact}>{fact}</Text>
            </View>
          );
        })}
        <TouchableOpacity style={styles.claimButton} onPress={handleClaimEcoPoints}>
          <Text style={styles.claimButtonText}>Claim EcoPoints (+{photos.length * 10})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={resetScreen}>
          <Text style={styles.secondaryButtonText}>Scan Again</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topNavBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={28} color="#2d6a4f" />
        </TouchableOpacity>
        <Text style={styles.topNavTitle}>Scan Waste</Text>
      </View>
      {photos.length > 0 && (
        <View style={styles.galleryContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {photos.map((photo, idx) => (
              <View key={`${photo.uri}-${idx}`} style={styles.thumbnailWrapper}>
                <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                <TouchableOpacity 
                  style={styles.removeButton} 
                  onPress={() => handleRemovePhoto(idx)} 
                  accessibilityLabel="Remove photo"
                >
                  <Ionicons name="close-circle" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      
      {!confirmed && (
        <TouchableOpacity
          style={styles.captureButton}
          onPress={handlePickImage}
          disabled={isProcessing}
          accessibilityLabel="Pick image"
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="large" />
          ) : (
            <Ionicons name="image" size={36} color="#fff" />
          )}
        </TouchableOpacity>
      )}
      
      {photos.length > 0 && !confirmed && (
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handleConfirm} 
          accessibilityLabel="Confirm photos"
        >
          <Ionicons name="checkmark" size={24} color="#fff" />
          <Text style={styles.buttonText}>Confirm ({photos.length})</Text>
        </TouchableOpacity>
      )}

      {confirmed && (
        <View style={styles.uploadContainer}>
          <TouchableOpacity 
            style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]} 
            onPress={handleUpload} 
            disabled={uploading} 
            accessibilityLabel="Upload photos"
          >
            {uploading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="cloud-upload" size={24} color="#fff" />
                <Text style={styles.buttonText}>Upload ({photos.length})</Text>
              </>
            )}
          </TouchableOpacity>
          
          {uploading && (
            <View style={styles.progressContainer}>
              <Text style={styles.uploadProgress}>Classifying image...</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}
          
          {!uploading && confirmed && (
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={resetScreen}
              accessibilityLabel="Reset"
            >
              <Ionicons name="refresh" size={24} color="#fff" />
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {classificationResults.length > 0 && (
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
          <View style={{
            backgroundColor: '#fff',
            marginTop: 32,
            marginBottom: 16,
            padding: 24,
            borderRadius: 22,
            alignItems: 'center',
            width: SCREEN_WIDTH > 420 ? 400 : SCREEN_WIDTH - 24,
            alignSelf: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 7,
          }}>
            <Ionicons
              name={classificationResults[0].label === 'biodegradable' ? 'leaf' : 'trash'}
              size={64}
              color={classificationResults[0].label === 'biodegradable' ? '#2d6a4f' : '#e74c3c'}
              style={{ marginBottom: 16 }}
            />
            <Text style={{
              fontWeight: 'bold',
              fontSize: 28,
              color: classificationResults[0].label === 'biodegradable' ? '#2d6a4f' : '#e74c3c',
              marginBottom: 10,
              textTransform: 'capitalize',
              textAlign: 'center',
            }}>
              {classificationResults[0].label.replace('_', ' ')}
            </Text>
            <Text style={{ fontSize: 18, color: '#333', marginBottom: 6, fontWeight: '600' }}>
              Confidence: {Math.round((classificationResults[0].confidence || 0) * 100)}%
            </Text>
            <Text style={{ fontSize: 17, color: '#333', marginBottom: 14, textAlign: 'center' }}>
              {classificationResults[0].description}
            </Text>
            <Text style={{ fontSize: 16, color: '#2d6a4f', fontWeight: 'bold', marginBottom: 4 }}>Disposal Advice:</Text>
            <Text style={{ fontSize: 16, color: '#555', marginBottom: 12, textAlign: 'center' }}>
              {classificationResults[0].disposal}
            </Text>
            {classificationResults[0].example_items && (
              <View style={{ width: '100%', marginBottom: 14 }}>
                <Text style={{ fontSize: 16, color: '#2d6a4f', fontWeight: 'bold', marginBottom: 4 }}>Example Items:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {classificationResults[0].example_items.map((item, idx) => (
                    <View key={idx} style={{
                      backgroundColor: '#e9f5ee',
                      borderRadius: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      margin: 3,
                    }}>
                      <Text style={{ color: '#2d6a4f', fontSize: 15 }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <View style={{ width: '100%', marginTop: 18 }}>
              <Text style={{ fontSize: 17, color: '#388e3c', fontWeight: 'bold', marginBottom: 8 }}>
                How to Control and Reduce Waste:
              </Text>
              {wasteControlTips.map((tip, idx) => (
                <View key={idx} style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
                  <Ionicons name="checkmark-circle" size={18} color="#2d6a4f" style={{ marginRight: 6, marginTop: 2 }} />
                  <Text style={{ color: '#333', fontSize: 15, flex: 1 }}>{tip}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <WasteClassificationModal
        visible={showModal}
        results={classificationResults}
        onConfirm={handleModalConfirm}
        onClose={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 44,
    paddingBottom: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 20,
  },
  backButton: {
    padding: 6,
    marginRight: 10,
  },
  topNavTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6a4f',
    letterSpacing: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2d6a4f',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  galleryContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 4,
  },
  thumbnailWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    zIndex: 5,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#2d6a4f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  uploadContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    alignItems: 'center',
    zIndex: 6,
  },
  uploadButton: {
    backgroundColor: '#2d6a4f',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    width: 180,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.7,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 15,
    width: '100%',
  },
  uploadProgress: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2d6a4f',
    borderRadius: 2,
  },
  secondaryButton: {
    backgroundColor: '#6c757d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  claimButton: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  claimButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  fallbackTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  fallbackSubtitle: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  fallbackCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fallbackImage: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
  },
  fallbackLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginBottom: 4,
  },
  fallbackDesc: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    textAlign: 'center',
  },
  fallbackFact: {
    fontSize: 13,
    color: '#388e3c',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 4,
  },
});

export default ScanScreen;