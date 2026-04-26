import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const CommunityPulse = () => {
  const [stories, setStories] = useState([
    {
      id: 1,
      location: 'Kicukiro',
      action: 'reached 500kg of diverted plastic',
      timestamp: '2 mins ago',
      icon: '♻️',
      color: '#00C896',
    },
    {
      id: 2,
      location: 'Gasabo',
      action: 'completed 100 recycling scans',
      timestamp: '15 mins ago',
      icon: '📱',
      color: '#FF6B35',
    },
    {
      id: 3,
      location: 'Nyarugenge',
      action: 'planted 50 trees through eco points',
      timestamp: '1 hour ago',
      icon: '🌱',
      color: '#4ECDC4',
    },
    {
      id: 4,
      location: 'Kigali City',
      action: 'community earned 10,000 eco points',
      timestamp: '3 hours ago',
      icon: '🏆',
      color: '#FFD700',
    },
  ]);

  const [highFives, setHighFives] = useState({});
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleHighFive = (storyId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setHighFives((prev) => ({
      ...prev,
      [storyId]: (prev[storyId] || 0) + 1,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Animated.View
            style={[
              styles.pulseDot,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />
          <Text style={styles.title}>Community Pulse</Text>
        </View>
        <Text style={styles.subtitle}>Live impact from your community</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      >
        {stories.map((story) => (
          <LinearGradient
            key={story.id}
            colors={[`${story.color}15`, `${story.color}05`]}
            style={styles.storyCard}
          >
            <View style={styles.storyHeader}>
              <Text style={styles.storyIcon}>{story.icon}</Text>
              <View style={styles.storyMeta}>
                <Text style={styles.location}>{story.location}</Text>
                <Text style={styles.timestamp}>{story.timestamp}</Text>
              </View>
            </View>

            <Text style={styles.storyAction}>{story.action}</Text>

            <TouchableOpacity
              style={[
                styles.highFiveButton,
                { borderColor: story.color },
                highFives[story.id] && { backgroundColor: `${story.color}20` },
              ]}
              onPress={() => handleHighFive(story.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.highFiveIcon}>🙌</Text>
              <Text style={[styles.highFiveText, { color: story.color }]}>
                {highFives[story.id] || 0}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        ))}
      </ScrollView>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={20} color="#00C896" />
          <Text style={styles.statText}>2,450 Active</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="leaf" size={20} color="#FF6B35" />
          <Text style={styles.statText}>15.2T Diverted</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Ionicons name="trending-up" size={20} color="#4ECDC4" />
          <Text style={styles.statText}>+12% This Week</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF6B35',
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    marginLeft: 18,
  },
  storiesContainer: {
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  storyCard: {
    width: 280,
    borderRadius: 16,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  storyIcon: {
    fontSize: 28,
    marginRight: 10,
  },
  storyMeta: {
    flex: 1,
  },
  location: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  storyAction: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
    marginBottom: 12,
    fontWeight: '500',
  },
  highFiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  highFiveIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  highFiveText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  statText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
    color: '#1B5E20',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#ccc',
  },
});

export default CommunityPulse;
