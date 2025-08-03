import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const CollectionManagement = ({ navigation }) => {
  const [collections, setCollections] = useState([
    {
      id: 1,
      date: '2024-01-15',
      time: '09:00 AM',
      location: 'Main Office',
      wasteType: 'Plastic & Paper',
      quantity: '45 kg',
      status: 'Completed',
      employee: 'John Doe'
    },
    {
      id: 2,
      date: '2024-01-14',
      time: '02:30 PM',
      location: 'Warehouse',
      wasteType: 'Electronics',
      quantity: '12 kg',
      status: 'Completed',
      employee: 'Jane Smith'
    },
    {
      id: 3,
      date: '2024-01-13',
      time: '11:00 AM',
      location: 'Factory Floor',
      wasteType: 'Metal & Glass',
      quantity: '78 kg',
      status: 'Completed',
      employee: 'Mike Johnson'
    }
  ]);
  const [scheduledCollections, setScheduledCollections] = useState([
    {
      id: 1,
      date: '2024-01-16',
      time: '10:00 AM',
      location: 'Office Building A',
      wasteType: 'Mixed Waste',
      assignedTo: 'Sarah Wilson',
      status: 'Scheduled'
    },
    {
      id: 2,
      date: '2024-01-17',
      time: '03:00 PM',
      location: 'Production Line',
      wasteType: 'Plastic & Metal',
      assignedTo: 'David Brown',
      status: 'Scheduled'
    }
  ]);
  const [showAddCollection, setShowAddCollection] = useState(false);
  const [newCollection, setNewCollection] = useState({
    date: '',
    time: '',
    location: '',
    wasteType: '',
    assignedTo: ''
  });

  const handleAddCollection = () => {
    if (!newCollection.date || !newCollection.time || !newCollection.location || !newCollection.wasteType) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all required fields'
      });
      return;
    }

    const collection = {
      id: scheduledCollections.length + 1,
      ...newCollection,
      status: 'Scheduled'
    };

    setScheduledCollections([...scheduledCollections, collection]);
    setNewCollection({ date: '', time: '', location: '', wasteType: '', assignedTo: '' });
    setShowAddCollection(false);
    
    Toast.show({
      type: 'success',
      text1: 'Collection Scheduled',
      text2: `Collection scheduled for ${collection.date}`
    });
  };

  const handleCompleteCollection = (collectionId) => {
    Alert.alert(
      'Complete Collection',
      'Mark this collection as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            const collection = scheduledCollections.find(c => c.id === collectionId);
            if (collection) {
              const completedCollection = {
                ...collection,
                id: collections.length + 1,
                status: 'Completed',
                employee: collection.assignedTo,
                quantity: '25 kg' // Mock quantity
              };
              setCollections([completedCollection, ...collections]);
              setScheduledCollections(scheduledCollections.filter(c => c.id !== collectionId));
              Toast.show({
                type: 'success',
                text1: 'Collection Completed',
                text2: 'Collection has been marked as completed'
              });
            }
          }
        }
      ]
    );
  };

  const handleCancelCollection = (collectionId) => {
    Alert.alert(
      'Cancel Collection',
      'Are you sure you want to cancel this collection?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Cancel Collection',
          style: 'destructive',
          onPress: () => {
            setScheduledCollections(scheduledCollections.filter(c => c.id !== collectionId));
            Toast.show({
              type: 'success',
              text1: 'Collection Cancelled',
              text2: 'Collection has been cancelled'
            });
          }
        }
      ]
    );
  };

  const totalCompleted = collections.length;
  const totalScheduled = scheduledCollections.length;
  const totalQuantity = collections.reduce((sum, c) => sum + parseInt(c.quantity), 0);

  return (
    <LinearGradient
      colors={["#43e97b", "#11998e"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#43e97b" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Collection Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddCollection(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{totalCompleted}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{totalScheduled}</Text>
              <Text style={styles.statLabel}>Scheduled</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="scale" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{totalQuantity}kg</Text>
              <Text style={styles.statLabel}>Total Collected</Text>
            </View>
          </View>

          {/* Scheduled Collections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scheduled Collections</Text>
            {scheduledCollections.map((collection) => (
              <View key={collection.id} style={styles.collectionCard}>
                <View style={styles.collectionHeader}>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.collectionDate}>{collection.date} at {collection.time}</Text>
                    <Text style={styles.collectionLocation}>{collection.location}</Text>
                    <Text style={styles.collectionType}>{collection.wasteType}</Text>
                    <Text style={styles.collectionAssigned}>Assigned to: {collection.assignedTo}</Text>
                  </View>
                  <View style={styles.collectionStatus}>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{collection.status}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.collectionActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCompleteCollection(collection.id)}
                  >
                    <Ionicons name="checkmark" size={16} color="#11998e" />
                    <Text style={styles.actionText}>Complete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCancelCollection(collection.id)}
                  >
                    <Ionicons name="close" size={16} color="#e74c3c" />
                    <Text style={[styles.actionText, { color: '#e74c3c' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          {/* Recent Collections */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Collections</Text>
            {collections.slice(0, 5).map((collection) => (
              <View key={collection.id} style={styles.collectionCard}>
                <View style={styles.collectionHeader}>
                  <View style={styles.collectionInfo}>
                    <Text style={styles.collectionDate}>{collection.date} at {collection.time}</Text>
                    <Text style={styles.collectionLocation}>{collection.location}</Text>
                    <Text style={styles.collectionType}>{collection.wasteType}</Text>
                    <Text style={styles.collectionQuantity}>Quantity: {collection.quantity}</Text>
                    <Text style={styles.collectionEmployee}>Collected by: {collection.employee}</Text>
                  </View>
                  <View style={styles.collectionStatus}>
                    <View style={[styles.statusBadge, styles.completedBadge]}>
                      <Text style={styles.statusText}>{collection.status}</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add Collection Modal */}
        {showAddCollection && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Schedule Collection</Text>
                <TouchableOpacity
                  onPress={() => setShowAddCollection(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Date</Text>
                <TextInput
                  style={styles.input}
                  value={newCollection.date}
                  onChangeText={(text) => setNewCollection({...newCollection, date: text})}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Time</Text>
                <TextInput
                  style={styles.input}
                  value={newCollection.time}
                  onChangeText={(text) => setNewCollection({...newCollection, time: text})}
                  placeholder="HH:MM AM/PM"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  value={newCollection.location}
                  onChangeText={(text) => setNewCollection({...newCollection, location: text})}
                  placeholder="Collection location"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Waste Type</Text>
                <TextInput
                  style={styles.input}
                  value={newCollection.wasteType}
                  onChangeText={(text) => setNewCollection({...newCollection, wasteType: text})}
                  placeholder="Type of waste"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Assigned To</Text>
                <TextInput
                  style={styles.input}
                  value={newCollection.assignedTo}
                  onChangeText={(text) => setNewCollection({...newCollection, assignedTo: text})}
                  placeholder="Employee name"
                  placeholderTextColor="#888"
                />
              </View>
              
              <TouchableOpacity
                style={styles.addCollectionButton}
                onPress={handleAddCollection}
              >
                <LinearGradient
                  colors={['#11998e', '#43e97b']}
                  style={styles.addCollectionGradient}
                >
                  <Text style={styles.addCollectionButtonText}>Schedule Collection</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11998e',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  collectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  collectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  collectionLocation: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  collectionType: {
    fontSize: 14,
    color: '#11998e',
    fontWeight: '500',
    marginTop: 2,
  },
  collectionQuantity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  collectionEmployee: {
    fontSize: 14,
    color: '#666'
  }
});
export default CollectionManagement;