import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const BinLinkingScreen = ({ navigation }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [linkedBin, setLinkedBin] = useState(null);

  // Animations
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Dummy bin data
  const dummyBins = [
    {
      id: 'BIN-KGL-001',
      name: 'Smart Bin - Kigali Central',
      location: 'Nyarugenge District',
      capacity: '120L',
      type: 'Mixed Waste',
    },
    {
      id: 'BIN-KGL-002',
      name: 'Smart Bin - Kimironko',
      location: 'Gasabo District',
      capacity: '120L',
      type: 'Recyclables',
    },
    {
      id: 'BIN-KGL-003',
      name: 'Smart Bin - Remera',
      location: 'Gasabo District',
      capacity: '120L',
      type: 'Organic Waste',
    },
  ];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (isScanning) {
      // Scanning line animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Simulate scan completion after 3 seconds
      setTimeout(() => {
        const randomBin = dummyBins[Math.floor(Math.random() * dummyBins.length)];
        setLinkedBin(randomBin);
        setScanComplete(true);
        setIsScanning(false);

        // Success animation
        Animated.spring(successAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }).start();
      }, 3000);
    }
  }, [isScanning]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanComplete(false);
  };

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  const handleSkip = () => {
    navigation.navigate('Login');
  };

  const scanLineTranslateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F766E" />
      
      <LinearGradient
        colors={['#0F766E', '#14B8A6', '#10B981']}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="qr-code" size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Link Your Smart Bin</Text>
            <Text style={styles.subtitle}>
              {scanComplete 
                ? 'Successfully connected to your bin!' 
                : 'Scan the QR code on your smart bin to connect it to your account'}
            </Text>
          </View>

          {/* Scanner Area */}
          {!scanComplete ? (
            <View style={styles.scannerContainer}>
              <Animated.View 
                style={[
                  styles.scannerFrame,
                  { transform: [{ scale: isScanning ? pulseAnim : 1 }] }
                ]}
              >
                {/* Corner Brackets */}
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />

                {/* QR Code Placeholder */}
                {!isScanning && (
                  <View style={styles.qrPlaceholder}>
                    <Ionicons name="qr-code-outline" size={120} color="rgba(255,255,255,0.3)" />
                  </View>
                )}

                {/* Scanning Line */}
                {isScanning && (
                  <Animated.View
                    style={[
                      styles.scanLine,
                      { transform: [{ translateY: scanLineTranslateY }] }
                    ]}
                  />
                )}

                {/* Scanning Indicator */}
                {isScanning && (
                  <View style={styles.scanningIndicator}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.scanningText}>Scanning QR Code...</Text>
                  </View>
                )}
              </Animated.View>

              {/* Scan Button */}
              {!isScanning && (
                <TouchableOpacity
                  style={styles.scanButton}
                  onPress={handleStartScan}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F0FDFA']}
                    style={styles.scanButtonGradient}
                  >
                    <Ionicons name="scan" size={24} color="#0F766E" style={{ marginRight: 8 }} />
                    <Text style={styles.scanButtonText}>Start Scanning</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            // Success View
            <ScrollView 
              style={styles.successScrollView}
              contentContainerStyle={styles.successScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Animated.View 
                style={[
                  styles.successContainer,
                  { 
                    opacity: successAnim,
                    transform: [{ 
                      scale: successAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1]
                      })
                    }]
                  }
                ]}
              >
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={80} color="#10B981" />
                </View>

                <View style={styles.binInfoCard}>
                  <View style={styles.binInfoHeader}>
                    <Ionicons name="trash-bin" size={32} color="#0F766E" />
                    <Text style={styles.binInfoTitle}>Bin Connected!</Text>
                  </View>

                  <View style={styles.binInfoRow}>
                    <Text style={styles.binInfoLabel}>Bin ID:</Text>
                    <Text style={styles.binInfoValue}>{linkedBin?.id}</Text>
                  </View>

                  <View style={styles.binInfoRow}>
                    <Text style={styles.binInfoLabel}>Name:</Text>
                    <Text style={styles.binInfoValue}>{linkedBin?.name}</Text>
                  </View>

                  <View style={styles.binInfoRow}>
                    <Text style={styles.binInfoLabel}>Location:</Text>
                    <Text style={styles.binInfoValue}>{linkedBin?.location}</Text>
                  </View>

                  <View style={styles.binInfoRow}>
                    <Text style={styles.binInfoLabel}>Capacity:</Text>
                    <Text style={styles.binInfoValue}>{linkedBin?.capacity}</Text>
                  </View>

                  <View style={styles.binInfoRow}>
                    <Text style={styles.binInfoLabel}>Type:</Text>
                    <Text style={styles.binInfoValue}>{linkedBin?.type}</Text>
                  </View>

                  <View style={styles.featuresList}>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.featureText}>Real-time fill monitoring</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.featureText}>Automatic pickup scheduling</Text>
                    </View>
                    <View style={styles.featureItem}>
                      <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      <Text style={styles.featureText}>Earn EcoPoints for recycling</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.continueButton}
                  onPress={handleContinue}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFFFFF', '#F0FDFA']}
                    style={styles.continueButtonGradient}
                  >
                    <Text style={styles.continueButtonText}>Continue to Login</Text>
                    <Ionicons name="arrow-forward" size={20} color="#0F766E" />
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          )}
          {/* Skip Button */}
          {!scanComplete && !isScanning && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for now</Text>
              <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: width * 0.7,
    height: width * 0.7,
    maxWidth: 280,
    maxHeight: 280,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 10,
    left: 10,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 10,
    right: 10,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 10,
    left: 10,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 10,
    right: 10,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  qrPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanLine: {
    position: 'absolute',
    width: '90%',
    height: 3,
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  scanningIndicator: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  scanButton: {
    marginTop: 40,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  scanButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F766E',
  },
  successScrollView: {
    flex: 1,
  },
  successScrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successIcon: {
    marginBottom: 24,
  },
  binInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  binInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  binInfoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F766E',
    marginLeft: 12,
  },
  binInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  binInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  binInfoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  featuresList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: '#E2E8F0',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginLeft: 8,
  },
  continueButton: {
    marginTop: 24,
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  continueButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F766E',
    marginRight: 8,
  },
  skipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    padding: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
    marginRight: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginLeft: 10,
  },
});

export default BinLinkingScreen;
