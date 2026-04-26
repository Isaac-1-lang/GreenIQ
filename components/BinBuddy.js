import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const BinBuddy = ({ fillPercentage = 50, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;

  // Determine bin state based on fill percentage
  const getBinState = () => {
    if (fillPercentage < 20) return 'happy';
    if (fillPercentage > 80) return 'anxious';
    return 'neutral';
  };

  const binState = getBinState();

  // Animate based on state
  useEffect(() => {
    if (binState === 'happy') {
      // Happy bounce animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -10,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else if (binState === 'anxious') {
      // Anxious shake animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [binState]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Pulse animation on tap
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const getEmotion = () => {
    switch (binState) {
      case 'happy':
        return { icon: '😊', color: '#00C896', message: 'Keep it up!' };
      case 'anxious':
        return { icon: '😰', color: '#FF6B35', message: 'Book a pickup!' };
      default:
        return { icon: '😐', color: '#4ECDC4', message: 'Doing great!' };
    }
  };

  const emotion = getEmotion();
  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-3deg', '3deg'],
  });

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={[
          styles.binContainer,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: bounceAnim },
              { rotate: rotateInterpolate },
            ],
          },
        ]}
      >
        {/* Bin Body */}
        <View
          style={[
            styles.bin,
            {
              backgroundColor:
                binState === 'happy'
                  ? '#E8F5E9'
                  : binState === 'anxious'
                  ? '#FFEBEE'
                  : '#E0F7FA',
              borderColor: emotion.color,
            },
          ]}
        >
          {/* Bin Face */}
          <View style={styles.face}>
            <Text style={styles.emotionIcon}>{emotion.icon}</Text>
          </View>

          {/* Fill Level Indicator */}
          <View style={styles.fillContainer}>
            <View
              style={[
                styles.fillBar,
                {
                  height: `${fillPercentage}%`,
                  backgroundColor:
                    fillPercentage > 80
                      ? '#FF6B35'
                      : fillPercentage > 50
                      ? '#FFB74D'
                      : '#00C896',
                },
              ]}
            />
          </View>

          {/* Percentage Text */}
          <Text style={styles.percentageText}>{Math.round(fillPercentage)}%</Text>
        </View>

        {/* Message */}
        <Text
          style={[
            styles.message,
            { color: emotion.color, fontWeight: 'bold' },
          ]}
        >
          {emotion.message}
        </Text>

        {/* Status Indicator */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: emotion.color },
            ]}
          />
          <Text style={styles.statusText}>
            {binState === 'happy'
              ? 'Bin Happy'
              : binState === 'anxious'
              ? 'Bin Full'
              : 'Bin Neutral'}
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  binContainer: {
    alignItems: 'center',
  },
  bin: {
    width: 100,
    height: 140,
    borderRadius: 16,
    borderWidth: 3,
    padding: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  face: {
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  emotionIcon: {
    fontSize: 32,
  },
  fillContainer: {
    width: 30,
    height: 60,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  fillBar: {
    width: '100%',
    borderRadius: 6,
  },
  percentageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
});

export default BinBuddy;
