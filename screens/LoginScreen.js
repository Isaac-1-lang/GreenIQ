import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { UserContext } from '../context/UserContext';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));

  // Animations
  const formAnim = useRef(new Animated.Value(0)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const { setUser, setUserType } = useContext(UserContext);

  const window = useWindowDimensions();
  const isTablet = window.width >= 700;
  const isLandscape = window.width > window.height;

  // Handle screen orientation changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    // Staggered animations for better UX
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 1000,
        delay: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignIn = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Fields',
        text2: 'Please enter both email and password.',
        position: 'top',
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('https://trash2treasure-backend.onrender.com/Login', {
        email,
        password
      });
      
      // Set user data and type
      setUser(response.data);
      setUserType(response.data.userRole || 'citizen');
      navigation.navigate('Home');
      
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Login successful',
        position: 'top',
      });
      
      // Navigate based on user type
      if (response.data.userRole === 'company') {
        navigation.navigate('CompanyHome');
      } else {
        navigation.navigate('Home');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || 'Invalid credentials',
        position: 'top',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSmallScreen = screenData.width < 400 || screenData.height < 700;

  return (
    <LinearGradient
      colors={["#43e97b", "#11998e"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#43e97b" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.centerWrapper, isTablet && styles.centerWrapperTablet]}> {/* Center everything */}
            <ScrollView
              contentContainerStyle={[
                styles.scrollViewContent,
                isLandscape && styles.landscapeContent,
                isTablet && styles.scrollViewContentTablet,
              ]}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Header Section */}
              <Animated.View
                style={[
                  styles.headerContainer,
                  isTablet && styles.headerContainerTablet,
                  { opacity: fadeAnim }
                ]}
              >
                <Animated.View
                  style={[
                    styles.logoContainer,
                    isTablet && styles.logoContainerTablet,
                    {
                      opacity: logoAnim,
                      transform: [
                        {
                          scale: logoAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0.5, 1],
                          }),
                        },
                        {
                          translateY: logoAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <Ionicons name="leaf" size={isTablet ? 70 : isSmallScreen ? 40 : 50} color="#11998e" style={styles.logoIcon} />
                  <Text style={[styles.appName, isSmallScreen && styles.appNameSmall, isTablet && styles.appNameTablet]}>
                    Green IQ
                  </Text>
                </Animated.View>
                <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall, isTablet && styles.headerTitleTablet]}>
                  Welcome Back!
                </Text>
                <Text style={[styles.headerSubtitle, isSmallScreen && styles.headerSubtitleSmall, isTablet && styles.headerSubtitleTablet]}>
                  Sign in to continue your sustainable journey
                </Text>
              </Animated.View>

              {/* Form Section */}
              <Animated.View
                style={[
                  styles.formContainer,
                  isLandscape && styles.formContainerLandscape,
                  isSmallScreen && styles.formContainerSmall,
                  isTablet && styles.formContainerTablet,
                  {
                    opacity: formAnim,
                    transform: [
                      {
                        translateY: formAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.formContent, isSmallScreen && styles.formContentSmall, isTablet && styles.formContentTablet]}>
                  {/* Email Input */}
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons
                      name="mail-outline"
                      size={isTablet ? 28 : isSmallScreen ? 20 : 22}
                      color="#11998e"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}
                      placeholder="Email Address"
                      placeholderTextColor="#888"
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  {/* Password Input */}
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={isTablet ? 28 : isSmallScreen ? 20 : 22}
                      color="#11998e"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}
                      placeholder="Password"
                      placeholderTextColor="#888"
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoCorrect={false}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={isTablet ? 28 : isSmallScreen ? 20 : 22}
                        color="#11998e"
                      />
                    </TouchableOpacity>
                  </View>
                  {/* Forgot Password Link */}
                  <TouchableOpacity 
                    style={styles.forgotPasswordButton}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={[styles.forgotPasswordLink, isSmallScreen && styles.forgotPasswordLinkSmall, isTablet && styles.forgotPasswordLinkTablet]}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                  {/* Sign In Button */}
                  <TouchableOpacity
                    style={[
                      styles.signInButton,
                      isSmallScreen && styles.signInButtonSmall,
                      isTablet && styles.signInButtonTablet,
                      (!email || !password) && styles.disabledButton,
                    ]}
                    disabled={!email || !password || isLoading}
                    onPress={handleSignIn}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={['#43e97b', '#11998e']}
                      style={[styles.signInGradient, isSmallScreen && styles.signInGradientSmall, isTablet && styles.signInGradientTablet]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={[styles.signInButtonText, isSmallScreen && styles.signInButtonTextSmall, isTablet && styles.signInButtonTextTablet]}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                   
                    <View style={styles.divider} />
                  </View>
                 
                  {/* Sign Up Link */}
                  <View style={styles.signUpContainer}>
                    <Text style={[styles.signUpText, isSmallScreen && styles.signUpTextSmall, isTablet && styles.signUpTextTablet]}>
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Register')}>
                      <Text style={[styles.signUpLink, isSmallScreen && styles.signUpLinkSmall, isTablet && styles.signUpLinkTablet]}>
                        Sign Up
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrapperTablet: {
    minHeight: height * 0.9,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollViewContentTablet: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  landscapeContent: {
    paddingHorizontal: 40,
  },
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  headerContainerSmall: {
    marginBottom: 24,
  },
  headerContainerTablet: {
    marginBottom: 48,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainerTablet: {
    marginBottom: 18,
  },
  logoIcon: {
    marginBottom: 6,
  },
  appName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1.5,
  },
  appNameSmall: {
    fontSize: 20,
  },
  appNameTablet: {
    fontSize: 36,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerTitleSmall: {
    fontSize: 22,
  },
  headerTitleTablet: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#11998e',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: '500',
  },
  headerSubtitleSmall: {
    fontSize: 13,
    paddingHorizontal: 30,
  },
  headerSubtitleTablet: {
    fontSize: 20,
    paddingHorizontal: 40,
  },
  // Form Styles
  formContainer: {
    width: '90%',
    maxWidth: 600,
    minWidth: 320,
    alignSelf: 'center',
    marginVertical: 32,
  },
  formContainerLandscape: {
    maxWidth: 700,
  },
  formContainerSmall: {
    maxWidth: 350,
  },
  formContainerTablet: {
    maxWidth: 700,
    minWidth: 400,
  },
  formContent: {
    backgroundColor: '#fff',
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 10,
  },
  formContentSmall: {
    padding: 16,
    borderRadius: 14,
  },
  formContentTablet: {
    paddingVertical: 48,
    paddingHorizontal: 48,
    borderRadius: 32,
  },
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: '#e0e0e0',
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputContainerSmall: {
    height: 42,
    borderRadius: 10,
    marginBottom: 12,
  },
  inputContainerTablet: {
    height: 60,
    borderRadius: 18,
    marginBottom: 28,
    paddingHorizontal: 18,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#222',
    fontSize: 15,
  },
  inputSmall: {
    fontSize: 13,
  },
  inputTablet: {
    fontSize: 20,
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  // Button Styles
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    paddingVertical: 2,
  },
  forgotPasswordText: {
    color: '#11998e',
    fontSize: 13,
    fontWeight: '500',
  },
  forgotPasswordTextSmall: {
    fontSize: 12,
  },
  forgotPasswordTextTablet: {
    fontSize: 16,
  },
  signInButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonSmall: {
    borderRadius: 14,
    marginBottom: 16,
  },
  signInButtonTablet: {
    borderRadius: 32,
    marginBottom: 32,
  },
  disabledButton: {
    shadowOpacity: 0.1,
    elevation: 1,
    opacity: 0.7,
  },
  signInGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  signInGradientSmall: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  signInGradientTablet: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signInButtonTextSmall: {
    fontSize: 14,
  },
  signInButtonTextTablet: {
    fontSize: 22,
  },
  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  dividerTextSmall: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  dividerTextTablet: {
    fontSize: 16,
    marginHorizontal: 18,
  },
  // Social Login Styles
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 12,
  },
  socialLoginContainerSmall: {
    gap: 8,
  },
  socialLoginContainerTablet: {
    gap: 20,
    marginBottom: 28,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  socialButtonTablet: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  // Sign Up Styles
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  signUpText: {
    color: '#888',
    fontSize: 13,
  },
  signUpTextSmall: {
    fontSize: 12,
  },
  signUpTextTablet: {
    fontSize: 16,
  },
  signUpLink: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
  },
  signUpLinkSmall: {
    fontSize: 12,
  },
  signUpLinkTablet: {
    fontSize: 16,
  },
  forgotPasswordLink: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },
  forgotPasswordLinkSmall: {
    fontSize: 12,
  },
  forgotPasswordLinkTablet: {
    fontSize: 16,
  },
});

export default LoginScreen;