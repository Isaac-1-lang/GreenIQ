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

const EmployeeManagement = ({ navigation }) => {
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: 'Alice Murenzi',
      email: 'john.doe@company.com',
      role: 'Manager',
      itemsRecycled: 45,
      co2Saved: 12.5,
      lastActive: '2 hours ago'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      role: 'Employee',
      itemsRecycled: 32,
      co2Saved: 8.9,
      lastActive: '1 day ago'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      role: 'Employee',
      itemsRecycled: 28,
      co2Saved: 7.8,
      lastActive: '3 days ago'
    }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    role: 'Employee'
  });

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill in all required fields'
      });
      return;
    }

    const employee = {
      id: employees.length + 1,
      ...newEmployee,
      itemsRecycled: 0,
      co2Saved: 0,
      lastActive: 'Just added'
    };

    setEmployees([...employees, employee]);
    setNewEmployee({ name: '', email: '', role: 'Employee' });
    setShowAddEmployee(false);
    
    Toast.show({
      type: 'success',
      text1: 'Employee Added',
      text2: `${employee.name} has been added to your team`
    });
  };

  const handleRemoveEmployee = (employeeId) => {
    Alert.alert(
      'Remove Employee',
      'Are you sure you want to remove this employee?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setEmployees(employees.filter(emp => emp.id !== employeeId));
            Toast.show({
              type: 'success',
              text1: 'Employee Removed',
              text2: 'Employee has been removed from your team'
            });
          }
        }
      ]
    );
  };

  const totalItemsRecycled = employees.reduce((sum, emp) => sum + emp.itemsRecycled, 0);
  const totalCo2Saved = employees.reduce((sum, emp) => sum + emp.co2Saved, 0);

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
          <Text style={styles.headerTitle}>Employee Management</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddEmployee(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{employees.length}</Text>
              <Text style={styles.statLabel}>Total Employees</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="recycle" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{totalItemsRecycled}</Text>
              <Text style={styles.statLabel}>Items Recycled</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="leaf" size={24} color="#11998e" />
              <Text style={styles.statNumber}>{totalCo2Saved.toFixed(1)}</Text>
              <Text style={styles.statLabel}>CO2 Saved (kg)</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employees..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#888"
            />
          </View>

          {/* Employee List */}
          <View style={styles.employeeList}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            {filteredEmployees.map((employee) => (
              <View key={employee.id} style={styles.employeeCard}>
                <View style={styles.employeeInfo}>
                  <View style={styles.employeeAvatar}>
                    <Ionicons name="person" size={24} color="#11998e" />
                  </View>
                  <View style={styles.employeeDetails}>
                    <Text style={styles.employeeName}>{employee.name}</Text>
                    <Text style={styles.employeeEmail}>{employee.email}</Text>
                    <Text style={styles.employeeRole}>{employee.role}</Text>
                  </View>
                </View>
                <View style={styles.employeeStats}>
                  <View style={styles.statItem}>
                    <Ionicons name="recycle" size={16} color="#11998e" />
                    <Text style={styles.statText}>{employee.itemsRecycled}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Ionicons name="leaf" size={16} color="#11998e" />
                    <Text style={styles.statText}>{employee.co2Saved.toFixed(1)}kg</Text>
                  </View>
                  <Text style={styles.lastActive}>{employee.lastActive}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveEmployee(employee.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Add Employee Modal */}
        {showAddEmployee && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Add New Employee</Text>
                <TouchableOpacity
                  onPress={() => setShowAddEmployee(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={newEmployee.name}
                  onChangeText={(text) => setNewEmployee({...newEmployee, name: text})}
                  placeholder="Enter full name"
                  placeholderTextColor="#888"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={newEmployee.email}
                  onChangeText={(text) => setNewEmployee({...newEmployee, email: text})}
                  placeholder="Enter email address"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newEmployee.role === 'Employee' && styles.roleButtonActive
                    ]}
                    onPress={() => setNewEmployee({...newEmployee, role: 'Employee'})}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newEmployee.role === 'Employee' && styles.roleButtonTextActive
                    ]}>Employee</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      newEmployee.role === 'Manager' && styles.roleButtonActive
                    ]}
                    onPress={() => setNewEmployee({...newEmployee, role: 'Manager'})}
                  >
                    <Text style={[
                      styles.roleButtonText,
                      newEmployee.role === 'Manager' && styles.roleButtonTextActive
                    ]}>Manager</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.addEmployeeButton}
                onPress={handleAddEmployee}
              >
                <LinearGradient
                  colors={['#11998e', '#43e97b']}
                  style={styles.addEmployeeGradient}
                >
                  <Text style={styles.addEmployeeButtonText}>Add Employee</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 12,
  },
  employeeList: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  employeeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  employeeInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  employeeEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  employeeRole: {
    fontSize: 12,
    color: '#11998e',
    fontWeight: '500',
    marginTop: 2,
  },
  employeeStats: {
    alignItems: 'flex-end',
    marginRight: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  lastActive: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#11998e',
    borderColor: '#11998e',
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleButtonTextActive: {
    color: '#fff',
  },
  addEmployeeButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  addEmployeeGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  addEmployeeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EmployeeManagement; 