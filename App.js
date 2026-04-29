import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppRegistry } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import CompanyPortal from './screens/CompanyPortal';
import EmployeeManagement from './screens/EmployeeManagement';
import CollectionManagement from './screens/CollectionManagement';
import CollectionPoints from './screens/CollectionPoints';
import Chat from './screens/Chat';
import ScanScreen from './screens/ScanScreen';
import ProfileScreen from './screens/ProfileScreen';
import LocationSelectionScreen from './screens/LocationSelectionScreen';
import Toast from 'react-native-toast-message';
import ChatInfoScreen from './screens/ChatInfo';
import { UserProvider } from './context/UserContext';
import Dashboard from './screens/Dashboard';
import Achievements from './screens/Achievements';
import EcoPointsDetails from './screens/EcoPointsDetails';
import Leaderboard from './screens/Leaderboard';
import Community from './screens/Community';
import Rewards from './screens/Rewards';
import ReferralScreen from './screens/ReferralScreen';
import SafeZoneAlerts from './screens/SafeZoneAlerts';
import PublicBinsMap from './screens/PublicBinsMap';
import ScanChoiceScreen from './screens/ScanChoiceScreen';
import ProductScanScreen from './screens/ProductScanScreen';
import ClassificationResultScreen from './screens/ClassificationResultScreen';
import QuizScreen from './screens/QuizScreen';

// Placeholder Challenges screen
function ChallengesScreen({ navigation }) {
  const tips = [
    {
      title: 'Recycle Plastic Bottles',
      description: 'Always rinse and crush plastic bottles before recycling. Remove caps and labels if possible.'
    },
    {
      title: 'Compost Food Scraps',
      description: 'Composting reduces landfill waste and creates nutrient-rich soil for your garden.'
    },
    {
      title: 'Reuse Shopping Bags',
      description: 'Bring your own reusable bags to the store to cut down on plastic waste.'
    },
    {
      title: 'Recycle Electronics Responsibly',
      description: 'Take old electronics to certified e-waste centers instead of throwing them in the trash.'
    },
    {
      title: 'Buy in Bulk',
      description: 'Buying in bulk reduces packaging waste and is often more economical.'
    },
    {
      title: 'Choose Products with Less Packaging',
      description: 'Opt for products with minimal or recyclable packaging to reduce your environmental impact.'
    },
    {
      title: 'Fact: Aluminum Can Be Recycled Forever',
      description: 'Aluminum cans can be recycled indefinitely without losing quality.'
    },
    {
      title: 'Fact: Glass is 100% Recyclable',
      description: 'Glass can be recycled endlessly without loss in purity or quality.'
    },
    {
      title: 'Fact: Recycling 1 Ton of Paper Saves 17 Trees',
      description: 'Paper recycling conserves natural resources and reduces landfill space.'
    },
    {
      title: 'Fact: Composting Reduces Methane',
      description: 'Organic waste in landfills produces methane, a potent greenhouse gas. Composting helps prevent this.'
    },
    // More tips to fill the page
    {
      title: 'Fact: One Recycled Bottle Saves Enough Energy to Power a Light Bulb for 3 Hours',
      description: 'Small actions add up! Every bottle recycled makes a difference.'
    },
    {
      title: 'Fact: Recycling Steel Saves 75% of the Energy Needed to Make New Steel',
      description: 'Metal recycling is highly efficient and reduces mining.'
    },
    {
      title: 'Fact: E-Waste Contains Valuable Materials',
      description: 'Recycling electronics recovers gold, silver, and rare earth metals.'
    },
    {
      title: 'Fact: 91% of Plastic is Not Recycled',
      description: 'Reduce plastic use and recycle whenever possible to help change this.'
    },
    {
      title: 'Fact: Food Waste is a Major Source of Landfill Methane',
      description: 'Composting food scraps is one of the best ways to fight climate change at home.'
    },
    {
      title: 'Fact: Recycled Paper Uses 70% Less Energy',
      description: 'Producing recycled paper saves water and energy compared to new paper.'
    },
    {
      title: 'Fact: Recycling One Aluminum Can Saves Enough Energy to Run a TV for 3 Hours',
      description: 'Aluminum is one of the most valuable materials you can recycle.'
    },
    {
      title: 'Fact: Glass Bottles Take 4,000 Years to Decompose',
      description: 'Recycle glass to keep it out of landfills and in use.'
    },
    {
      title: 'Fact: Recycling Reduces Greenhouse Gas Emissions',
      description: 'Every item recycled means less pollution and a healthier planet.'
    },
    {
      title: 'Fact: You Can Recycle Paper Up to 7 Times',
      description: 'Keep paper in the recycling loop as long as possible.'
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fffe' }}>
      {/* Top bar with back arrow */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 16, backgroundColor: '#1B5E20', paddingHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()} style={{ padding: 6, marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>♻️ Recycling Tips & Facts</Text>
          <Text style={{ color: '#e0ffe0', fontSize: 14, marginTop: 6, textAlign: 'center', maxWidth: 320 }}>
            Learn how to recycle and manage products in a way that helps the planet!
          </Text>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 18 }}>
        <View style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
          {tips.map((tip, idx) => (
            <View key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#e0f7fa' : '#fffbe6', padding: 18, marginBottom: 12, borderRadius: 14, elevation: 2, shadowColor: '#1B5E20', shadowOpacity: 0.06, shadowRadius: 4 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: '#1B5E20', marginBottom: 6 }}>{tip.title}</Text>
              <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>{tip.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// The main app experience with the bottom tab bar for citizens
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Scan') {
            return (
              <View style={styles.scanButtonContainer}>
                <Ionicons name="scan" size={30} color="#fff" />
              </View>
            );
          } else if (route.name === 'RewardsTab') {
            iconName = focused ? 'gift' : 'gift-outline';
          } else if (route.name === 'Chat') {
            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
        tabBarLabelPosition: 'below-icon', // <-- force vertical layout
        tabBarStyle: route.name === 'Chat'
          ? { display: 'none' }
          : {
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 10,
              shadowOpacity: 0.1,
            },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="Map" component={PublicBinsMap} options={{ tabBarLabel: 'Public Bins', tabBarIcon: ({ color, size, focused }) => (
        <Ionicons name={focused ? 'trash-bin' : 'trash-bin-outline'} size={size} color={color} />
      ) }} />
      <Tab.Screen
        name="Scan"
        component={ScanScreen} // This component is a placeholder; the press action is overridden.
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action and navigate to the choice screen
            e.preventDefault();
            navigation.navigate('ScanChoice');
          },
        })}
        options={{ tabBarLabel: 'Scan' }}
      />
      <Tab.Screen name="RewardsTab" component={Rewards} options={{ tabBarLabel: 'Rewards' }} />
      <Tab.Screen name="Chat" component={CollectionPoints} options={{ tabBarLabel: 'Community' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Company portal with bottom tab bar
function CompanyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'CompanyHome') {
            iconName = focused ? 'business' : 'business-outline';
          } else if (route.name === 'CollectionMgmt') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Employees') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'CompanyProfile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2d6a4f',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
        tabBarLabelPosition: 'below-icon',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: 0.1,
        },
      })}
    >
      <Tab.Screen name="CompanyHome" component={CompanyPortal} options={{ tabBarLabel: 'Portal' }} />
      <Tab.Screen name="CollectionMgmt" component={CollectionManagement} options={{ tabBarLabel: 'Collection' }} />
      <Tab.Screen name="Analytics" component={Dashboard} options={{ tabBarLabel: 'Analytics' }} />
      <Tab.Screen name="Employees" component={EmployeeManagement} options={{ tabBarLabel: 'Employees' }} />
      <Tab.Screen name="CompanyProfile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// The complete app navigation flow
function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* Auth screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={SignupScreen} />
          <Stack.Screen name="LocationSelection" component={LocationSelectionScreen} />
          
          {/* Main app screens (with tab bar) */}
          <Stack.Screen name="Home" component={AppTabs} />
          <Stack.Screen name="CompanyHome" component={CompanyTabs} />
          <Stack.Screen name="Map" component={CollectionPoints} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="ChatInfo" component={ChatInfoScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} />
          <Stack.Screen name="Achievements" component={Achievements} />
          <Stack.Screen name="EcoPointsDetails" component={EcoPointsDetails} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
          <Stack.Screen name="Community" component={Community} />
          <Stack.Screen name="Rewards" component={Rewards} />
          <Stack.Screen name="Referral" component={ReferralScreen} />
          <Stack.Screen name="SafeZoneAlerts" component={SafeZoneAlerts} />
          <Stack.Screen name="PublicBinsMap" component={PublicBinsMap} />
          <Stack.Screen name="ScanChoice" component={ScanChoiceScreen} />
          <Stack.Screen name="Scan" component={ScanScreen} />
          <Stack.Screen name="ProductScan" component={ProductScanScreen} />
          <Stack.Screen name="ClassificationResult" component={ClassificationResultScreen} />
          <Stack.Screen name="Quiz" component={QuizScreen} />
          <Stack.Screen name="EmployeeManagement" component={EmployeeManagement} />
          <Stack.Screen name="CollectionManagement" component={CollectionManagement} />

        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  scanButtonContainer: {
    backgroundColor: '#2d6a4f',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Lifts the button up
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
});

AppRegistry.registerComponent('main', () => App);

export default App;