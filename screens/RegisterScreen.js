import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { COLORS, SIZES, SHADOWS } from '../utils/theme';

const { width, height } = Dimensions.get("window");

const RegisterScreen = ({ navigation, route }) => {
  const [userType, setUserType] = useState("citizen");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+250");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [location, setLocation] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyContact, setCompanyContact] = useState("");
  const [referralCode, setReferralCode] = useState('');
  const [wasteTypes, setWasteTypes] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // Animation
  const formAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const window = useWindowDimensions();
  const isTablet = window.width >= 700;
  const isSmallScreen = window.width < 400 || window.height < 700;
  const isLandscape = window.width > window.height;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  useEffect(() => {
    if (route?.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
    }
  }, [route?.params?.selectedLocation]);

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\+250[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async () => {
    if (userType === "citizen") {
      if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !location) {
        Toast.show({ type: "error", text1: "Missing Fields", text2: "Please fill out all fields for citizen registration." });
        return;
      }
    } else {
    if (!companyName || !email || !phoneNumber || !password || !confirmPassword || !companyAddress || !companyContact || wasteTypes.length === 0) {
        Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill out all fields for company registration.' });
        return;
      }
    }

    if (password !== confirmPassword) {
      Toast.show({ type: "error", text1: "Password Mismatch", text2: "Passwords do not match." });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Toast.show({ type: "error", text1: "Invalid Phone Number", text2: "Please enter a valid Rwandan phone number (+250XXXXXXXX)." });
      return;
    }

    setIsLoading(true);
    try {
      const { dummyUsers } = require('../utils/dummyData');
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: userType === 'citizen' ? 'Check your email to verify' : 'Company account created'
      });
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (error) {
      Toast.show({ type: "error", text1: "Registration failed", text2: error?.response?.data?.message || "Registration failed." });
    } finally {
      setIsLoading(false);
    }
  }

  const renderInput = (icon, placeholder, value, setValue, keyName, type = 'default', isPass = false, showPass = false, setShowPass = null) => {
    return (
      <View style={[
        styles.inputContainer,
        isSmallScreen && styles.inputContainerSmall,
        isTablet && styles.inputContainerTablet,
        focusedInput === keyName && styles.inputContainerFocused
      ]}>
        <Ionicons name={icon} size={isTablet ? 24 : 20} color={focusedInput === keyName ? COLORS.primary : COLORS.textMuted} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={setValue}
          keyboardType={type}
          secureTextEntry={isPass && !showPass}
          autoCapitalize={type === 'email-address' ? 'none' : 'words'}
          onFocus={() => setFocusedInput(keyName)}
          onBlur={() => setFocusedInput(null)}
        />
        {isPass && (
          <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeButton}>
            <Ionicons name={showPass ? "eye-off-outline" : "eye-outline"} size={isTablet ? 24 : 20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Dynamic Background */}
      <View style={styles.backgroundVectorTop} />
      <View style={styles.backgroundVectorBottom} />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Animated.View style={[styles.headerContainer, isTablet && styles.headerContainerTablet, { opacity: fadeAnim }]}>
              <View style={styles.logoIconBg}>
                <Ionicons name="leaf" size={isTablet ? 48 : 36} color={COLORS.primary} />
              </View>
              <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall, isTablet && styles.headerTitleTablet]}>
                Create Account
              </Text>
              <Text style={[styles.headerSubtitle, isSmallScreen && styles.headerSubtitleSmall, isTablet && styles.headerSubtitleTablet]}>
                Join Green IQ and help the planet today
              </Text>
            </Animated.View>

            <Animated.View style={[
              styles.formContainer,
              isLandscape && styles.formContainerLandscape,
              isSmallScreen && styles.formContainerSmall,
              isTablet && styles.formContainerTablet,
              { transform: [{ translateY: formAnim.interpolate({ inputRange: [0, 1], outputRange: [60, 0] }) }] },
            ]}>
              <View style={[styles.formContent, isSmallScreen && styles.formContentSmall, isTablet && styles.formContentTablet]}>
                
                {/* User Type Segmented Control */}
                <View style={styles.userTypeContainer}>
                  <TouchableOpacity
                    style={[styles.userTypeButton, userType === "citizen" && styles.userTypeButtonActive]}
                    onPress={() => setUserType("citizen")}
                  >
                    <Ionicons name="person" size={20} color={userType === "citizen" ? COLORS.surface : COLORS.primary} style={styles.typeIcon} />
                    <Text style={[styles.userTypeText, userType === "citizen" && styles.userTypeTextActive]}>Citizen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.userTypeButton, userType === "company" && styles.userTypeButtonActive]}
                    onPress={() => setUserType("company")}
                  >
                    <Ionicons name="business" size={20} color={userType === "company" ? COLORS.surface : COLORS.primary} style={styles.typeIcon} />
                    <Text style={[styles.userTypeText, userType === "company" && styles.userTypeTextActive]}>Company</Text>
                  </TouchableOpacity>
                </View>

                {userType === "citizen" ? (
                  renderInput("person-outline", "Full Name", fullName, setFullName, "fullName")
                ) : (
                  renderInput("business-outline", "Company Name", companyName, setCompanyName, "companyName")
                )}
                
                {renderInput("mail-outline", "Email Address", email, setEmail, "email", "email-address")}
                {renderInput("call-outline", "Phone Number (+250)", phoneNumber, setPhoneNumber, "phoneNumber", "phone-pad")}
                
                {userType === 'citizen' && renderInput("gift-outline", "Referral Code (Optional)", referralCode, setReferralCode, "referralCode")}

                {/* Location Picker */}
                {userType === "citizen" ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("LocationSelection")}
                    style={[styles.inputContainer, styles.locationPicker, focusedInput === 'location' && styles.inputContainerFocused]}
                    onPressIn={() => setFocusedInput('location')}
                    onPressOut={() => setFocusedInput(null)}
                  >
                    <Ionicons name="location-outline" size={20} color={focusedInput === 'location' ? COLORS.primary : COLORS.textMuted} style={styles.inputIcon} />
                    <Text style={[styles.input, !location && styles.placeholderText]}>{location || "Select Your Location"}</Text>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
                  </TouchableOpacity>
                ) : (
                  <>
                    {renderInput("location-outline", "Company Address", companyAddress, setCompanyAddress, "companyAddress")}
                    {renderInput("person-outline", "Contact Person Name", companyContact, setCompanyContact, "companyContact")}
                    
                    <Text style={styles.wasteTypesTitle}>Waste Types Collected:</Text>
                    <View style={styles.wasteTypesGrid}>
                      {['Biodegradable', 'Non biodegradable', 'Recyclable', 'Hazardous', "Organic", "Inorganic"].map((type) => {
                        const isActive = wasteTypes.includes(type);
                        return (
                          <TouchableOpacity
                            key={type}
                            style={[styles.wasteTypeButton, isActive && styles.wasteTypeButtonActive]}
                            onPress={() => {
                              isActive 
                                ? setWasteTypes(wasteTypes.filter(t => t !== type))
                                : setWasteTypes([...wasteTypes, type]);
                            }}
                          >
                            <Text style={[styles.wasteTypeText, isActive && styles.wasteTypeTextActive]}>{type}</Text>
                          </TouchableOpacity>
                        )
                      })}
                    </View>
                  </>
                )}

                {renderInput("lock-closed-outline", "Password", password, setPassword, "password", "default", true, showPassword, setShowPassword)}
                {renderInput("lock-closed-outline", "Confirm Password", confirmPassword, setConfirmPassword, "confirmPassword", "default", true, showConfirmPassword, setShowConfirmPassword)}

                {/* Sign Up Button */}
                <TouchableOpacity
                  onPress={handleRegister}
                  style={[styles.signInButton, isSmallScreen && styles.signInButtonSmall, isTablet && styles.signInButtonTablet]}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={COLORS.gradientPrimary}
                    style={[styles.signInGradient, isSmallScreen && styles.signInGradientSmall, isTablet && styles.signInGradientTablet]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.signInButtonText, isSmallScreen && styles.signInButtonTextSmall, isTablet && styles.signInButtonTextTablet]}>Sign Up</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Sign In Link */}
                <View style={styles.signInContainer}>
                  <Text style={[styles.signInText, isSmallScreen && styles.signInTextSmall, isTablet && styles.signInTextTablet]}>
                    Already have an account?{" "}
                  </Text>
                  <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate("Login")}>
                    <Text style={[styles.signInLink, isSmallScreen && styles.signInLinkSmall, isTablet && styles.signInLinkTablet]}>Sign In</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </Animated.View>
          </ScrollView>
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
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: SIZES.xl,
    paddingTop: SIZES.xxl,
    paddingBottom: SIZES.xxxl,
  },
  // Header Styles
  headerContainer: {
    alignItems: 'center',
    marginBottom: SIZES.l,
    width: '100%',
  },
  headerContainerTablet: {
    marginBottom: SIZES.xxl,
  },
  logoIconBg: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.m,
    ...SHADOWS.small,
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
    color: COLORS.textMuted,
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
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
  },
  formContainerLandscape: {
    maxWidth: 600,
  },
  formContainerSmall: {
    width: "100%",
  },
  formContainerTablet: {
    maxWidth: 550,
  },
  formContent: {
    backgroundColor: COLORS.surfaceGlass,
    paddingVertical: SIZES.xl,
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
  },
  // User Type Toggle
  userTypeContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: SIZES.radiusPill,
    padding: 4,
    marginBottom: SIZES.l,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: SIZES.radiusPill,
  },
  userTypeButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.small,
  },
  typeIcon: {
    marginRight: 6,
  },
  userTypeText: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  userTypeTextActive: {
    color: COLORS.surface,
  },
  // Input Styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
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
    fontWeight: "500",
  },
  inputSmall: {
    fontSize: SIZES.body2,
  },
  inputTablet: {
    fontSize: SIZES.h4,
  },
  placeholderText: {
    color: COLORS.textMuted,
  },
  eyeButton: {
    padding: SIZES.xs,
  },
  // Waste Types Grid
  wasteTypesTitle: {
    fontSize: SIZES.body2,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SIZES.s,
    marginTop: SIZES.xs,
  },
  wasteTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SIZES.l,
  },
  wasteTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: SIZES.radiusPill,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  wasteTypeButtonActive: {
    backgroundColor: '#E0F2FE',
    borderColor: COLORS.primaryLight,
  },
  wasteTypeText: {
    fontSize: SIZES.caption,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  wasteTypeTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  // SignIn Button
  signInButton: {
    borderRadius: SIZES.radiusPill,
    overflow: "hidden",
    marginVertical: SIZES.s,
    ...SHADOWS.medium,
  },
  signInButtonSmall: {
    marginBottom: SIZES.m,
  },
  signInButtonTablet: {
    marginBottom: SIZES.xl,
  },
  signInGradient: {
    justifyContent: "center",
    alignItems: "center",
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
    fontWeight: "700",
  },
  signInButtonTextSmall: {
    fontSize: SIZES.body1,
  },
  signInButtonTextTablet: {
    fontSize: SIZES.h3,
  },
  // Footer Link
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: SIZES.m,
  },
  signInText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.body2,
  },
  signInTextSmall: {
    fontSize: SIZES.caption,
  },
  signInTextTablet: {
    fontSize: SIZES.body1,
  },
  signInLink: {
    color: COLORS.primary,
    fontSize: SIZES.body2,
    fontWeight: "700",
  },
  signInLinkSmall: {
    fontSize: SIZES.caption,
  },
  signInLinkTablet: {
    fontSize: SIZES.body1,
  },
});

export default RegisterScreen;
