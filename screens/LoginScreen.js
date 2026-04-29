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
import { COLORS, SIZES, SHADOWS, GLOBAL_STYLES } from '../utils/theme';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const [focusedInput, setFocusedInput] = useState(null);

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
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(formAnim, {
        toValue: 1,
        friction: 8,
        tension: 30,
        delay: 200,
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
      // Using dummy data instead of backend API
      const { dummyUsers } = require('../utils/dummyData');
      const user = dummyUsers[0]; // Simulate finding user
      
      // Set user data and type
      setUser(user);
      setUserType(user.userRole || 'citizen');
      navigation.navigate('Home');
      
      Toast.show({
        type: 'success',
        text1: 'Welcome Back!',
        text2: 'Login successful',
        position: 'top',
      });
      
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
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Background */}
      <View style={styles.backgroundVectorTop} />
      <View style={styles.backgroundVectorBottom} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.centerWrapper, isTablet && styles.centerWrapperTablet]}>
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
                        { scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
                        { translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) },
                      ],
                    },
                  ]}
                >
                  <View style={styles.logoIconBg}>
                    <Ionicons name="leaf" size={isTablet ? 48 : 36} color={COLORS.primary} />
                  </View>
                  <Text style={[styles.appName, isSmallScreen && styles.appNameSmall, isTablet && styles.appNameTablet]}>
                    Green IQ
                  </Text>
                </Animated.View>
                
                <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall, isTablet && styles.headerTitleTablet]}>
                  Welcome Back
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
                          outputRange: [60, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.formContent, isSmallScreen && styles.formContentSmall, isTablet && styles.formContentTablet]}>
                  {/* Email Input */}
                  <View style={[
                    styles.inputContainer, 
                    isSmallScreen && styles.inputContainerSmall, 
                    isTablet && styles.inputContainerTablet,
                    focusedInput === 'email' && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="mail-outline"
                      size={isTablet ? 24 : 20}
                      color={focusedInput === 'email' ? COLORS.primary : COLORS.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}
                      placeholder="Email Address"
                      placeholderTextColor={COLORS.textMuted}
                      keyboardType="email-address"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                    />
                  </View>
                  
                  {/* Password Input */}
                  <View style={[
                    styles.inputContainer, 
                    isSmallScreen && styles.inputContainerSmall, 
                    isTablet && styles.inputContainerTablet,
                    focusedInput === 'password' && styles.inputContainerFocused
                  ]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={isTablet ? 24 : 20}
                      color={focusedInput === 'password' ? COLORS.primary : COLORS.textMuted}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}
                      placeholder="Password"
                      placeholderTextColor={COLORS.textMuted}
                      secureTextEntry={!showPassword}
                      value={password}
                      onChangeText={setPassword}
                      autoCorrect={false}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={isTablet ? 24 : 20}
                        color={COLORS.textMuted}
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
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={(!email || !password) ? [COLORS.textMuted, COLORS.textMuted] : COLORS.gradientPrimary}
                      style={[styles.signInGradient, isSmallScreen && styles.signInGradientSmall, isTablet && styles.signInGradientTablet]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={[styles.signInButtonText, isSmallScreen && styles.signInButtonTextSmall, isTablet && styles.signInButtonTextTablet]}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {/* Sign Up Link */}
                  <View style={styles.signUpContainer}>
                    <Text style={[styles.signUpText, isSmallScreen && styles.signUpTextSmall, isTablet && styles.signUpTextTablet]}>
                      Don't have an account?{' '}
                    </Text>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Register')}>
                      <Text style={[styles.signUpLink, isSmallScreen && styles.signUpLinkSmall, isTablet && styles.signUpLinkTablet]}>
                        Create an account
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundVectorTop: {
    position: 'absolute',
    top: -height * 0.1,
    right: -width * 0.2,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: COLORS.primaryLight,
    opacity: 0.15,
  },
  backgroundVectorBottom: {
    position: 'absolute',
    bottom: -height * 0.05,
    left: -width * 0.3,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: COLORS.accent,
    opacity: 0.1,
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
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.xl,
  },
  scrollViewContentTablet: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  landscapeContent: {
    paddingHorizontal: SIZES.xxl,
  },
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxl,
    width: '100%',
  },
  headerContainerTablet: {
    marginBottom: SIZES.xxxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.m,
  },
  logoContainerTablet: {
    marginBottom: SIZES.l,
  },
  logoIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.s,
    ...SHADOWS.small,
  },
  appName: {
    fontSize: SIZES.h2,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.5,
  },
  appNameSmall: {
    fontSize: SIZES.h3,
  },
  appNameTablet: {
    fontSize: SIZES.h1,
  },
  headerTitle: {
    fontSize: SIZES.h1,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SIZES.xs,
    textAlign: 'center',
  },
  headerTitleSmall: {
    fontSize: SIZES.h2,
  },
  headerTitleTablet: {
    fontSize: 40,
    marginBottom: SIZES.s,
  },
  headerSubtitle: {
    fontSize: SIZES.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  headerSubtitleSmall: {
    fontSize: SIZES.body2,
  },
  headerSubtitleTablet: {
    fontSize: SIZES.h4,
  },
  // Form Styles
  formContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  formContainerLandscape: {
    maxWidth: 600,
  },
  formContainerSmall: {
    width: '100%',
  },
  formContainerTablet: {
    maxWidth: 550,
  },
  formContent: {
    backgroundColor: COLORS.surfaceGlass,
    paddingVertical: SIZES.xxl,
    paddingHorizontal: SIZES.l,
    borderRadius: SIZES.radiusXl,
    ...SHADOWS.large,
  },
  formContentSmall: {
    padding: SIZES.m,
    borderRadius: SIZES.radiusLg,
  },
  formContentTablet: {
    paddingVertical: SIZES.xxxl,
    paddingHorizontal: SIZES.xl,
    borderRadius: 32,
  },
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    marginBottom: SIZES.m,
    paddingHorizontal: SIZES.m,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    height: 56,
  },
  inputContainerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#F8FAFC',
  },
  inputContainerSmall: {
    height: 48,
    borderRadius: SIZES.radiusSm,
    marginBottom: SIZES.s,
  },
  inputContainerTablet: {
    height: 64,
    borderRadius: SIZES.radiusLg,
    marginBottom: SIZES.l,
    paddingHorizontal: SIZES.l,
  },
  inputIcon: {
    marginRight: SIZES.s,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.body1,
    fontWeight: '500',
  },
  inputSmall: {
    fontSize: SIZES.body2,
  },
  inputTablet: {
    fontSize: SIZES.h4,
  },
  eyeButton: {
    padding: SIZES.xs,
  },
  // Button Styles
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.l,
  },
  forgotPasswordLink: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: '600',
    textAlign: 'right',
  },
  forgotPasswordLinkSmall: {
    fontSize: SIZES.caption,
  },
  forgotPasswordLinkTablet: {
    fontSize: SIZES.body1,
  },
  signInButton: {
    borderRadius: SIZES.radiusPill,
    overflow: 'hidden',
    marginBottom: SIZES.l,
    ...SHADOWS.medium,
  },
  signInButtonSmall: {
    marginBottom: SIZES.m,
  },
  signInButtonTablet: {
    marginBottom: SIZES.xl,
  },
  disabledButton: {
    opacity: 0.7,
    shadowOpacity: 0,
  },
  signInGradient: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,
  },
  signInGradientSmall: {
    height: 48,
  },
  signInGradientTablet: {
    height: 64,
  },
  signInButtonText: {
    color: COLORS.textInverse,
    fontSize: SIZES.h4,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInButtonTextSmall: {
    fontSize: SIZES.body1,
  },
  signInButtonTextTablet: {
    fontSize: SIZES.h3,
  },
  // Sign Up Styles
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.xs,
  },
  signUpText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  signUpTextSmall: {
    fontSize: SIZES.caption,
  },
  signUpTextTablet: {
    fontSize: SIZES.body1,
  },
  signUpLink: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: '700',
  },
  signUpLinkSmall: {
    fontSize: SIZES.caption,
  },
  signUpLinkTablet: {
    fontSize: SIZES.body1,
  },
});

export default LoginScreen;