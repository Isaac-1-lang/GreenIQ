# GreenIQ Build & Deployment Guide 🚀

## Pre-Build Security Checklist ✅

### 1. Environment Setup
- [x] `.gitignore` configured to exclude sensitive files
- [x] `.env.example` created (never commit actual `.env`)
- [x] Security utilities implemented
- [x] Input validation and sanitization in place
- [x] Secure storage for sensitive data

### 2. Code Security Review
- [x] No hardcoded API keys or secrets
- [x] All user inputs validated and sanitized
- [x] Secure storage used for sensitive data
- [x] HTTPS enforced for API calls (when backend is added)
- [x] Proper error handling (no sensitive data in errors)

### 3. App Configuration
- [x] Proper permissions declared
- [x] Privacy policy set to "unlisted"
- [x] Bundle identifiers configured
- [x] Version numbers set correctly

---

## Build Prerequisites

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project
```bash
eas build:configure
```

---

## Building for Android (APK)

### Option 1: Preview Build (Recommended for Testing)
This creates an APK you can install directly on Android devices.

```bash
eas build --platform android --profile preview
```

**What happens:**
1. Code is uploaded to Expo servers
2. Build runs on Expo's infrastructure
3. APK is generated and downloadable
4. QR code provided for easy installation

**Build time:** ~10-15 minutes

### Option 2: Production Build
For Play Store submission:

```bash
eas build --platform android --profile production
```

---

## Building for iOS

### Requirements:
- Apple Developer Account ($99/year)
- iOS device or simulator

### Development Build (Simulator)
```bash
eas build --platform ios --profile development
```

### Production Build (App Store)
```bash
eas build --platform ios --profile production
```

**Note:** iOS builds require Apple Developer credentials and certificates.

---

## Step-by-Step Build Process

### Step 1: Prepare for Build
```bash
# Clear cache
npx expo start --clear

# Install dependencies
npm install

# Check for issues
npm audit
```

### Step 2: Update Version
Edit `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1"
    }
  }
}
```

### Step 3: Build Android APK
```bash
# Start the build
eas build --platform android --profile preview

# Follow prompts:
# - Select Android credentials (auto-generate if first time)
# - Wait for build to complete
```

### Step 4: Download APK
After build completes:
1. **Download link** will be provided
2. **QR code** will be displayed
3. APK can be downloaded from Expo dashboard

---

## Installing the APK

### Method 1: QR Code (Easiest)
1. Open camera app on Android device
2. Scan the QR code from build output
3. Download and install APK

### Method 2: Direct Download
1. Copy the download link from build output
2. Open link on Android device
3. Download and install APK

### Method 3: Manual Transfer
1. Download APK to computer
2. Transfer to Android device via USB
3. Enable "Install from Unknown Sources"
4. Open APK file to install

---

## Security Configurations Applied

### 1. Secure Storage
```javascript
// Use for sensitive data (tokens, user credentials)
import { secureStorage } from './utils/security';

await secureStorage.save('authToken', token);
const token = await secureStorage.get('authToken');
```

### 2. Input Validation
```javascript
import { validate, sanitize } from './utils/security';

// Validate email
if (!validate.email(email)) {
  // Show error
}

// Sanitize input
const cleanInput = sanitize.text(userInput);
```

### 3. Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- Special characters recommended

### 4. Rate Limiting
```javascript
import { rateLimiter } from './utils/security';

if (!rateLimiter.isAllowed(userId)) {
  // Too many requests
}
```

---

## Permissions Explained

### Android Permissions
```json
{
  "CAMERA": "Scan waste items and QR codes",
  "READ_EXTERNAL_STORAGE": "Select photos for classification",
  "WRITE_EXTERNAL_STORAGE": "Save scanned results",
  "ACCESS_FINE_LOCATION": "Show nearby bins",
  "ACCESS_COARSE_LOCATION": "General location for bins",
  "INTERNET": "Connect to services",
  "ACCESS_NETWORK_STATE": "Check connectivity"
}
```

### iOS Permissions
All permissions include user-friendly descriptions explaining why they're needed.

---

## Build Profiles Explained

### Development
- **Purpose:** Testing during development
- **Distribution:** Internal only
- **Features:** Development client, debugging enabled
- **Output:** APK/IPA for testing

### Preview
- **Purpose:** Testing before production
- **Distribution:** Internal (team/testers)
- **Features:** Production-like, no debugging
- **Output:** APK/IPA for beta testing

### Production
- **Purpose:** App store submission
- **Distribution:** Public (stores)
- **Features:** Optimized, signed, ready for stores
- **Output:** AAB (Android) / IPA (iOS)

---

## Testing the Build

### 1. Install on Device
```bash
# Scan QR code or download APK
# Install on Android device
```

### 2. Test Core Features
- [ ] Registration flow
- [ ] Login functionality
- [ ] Bin linking (QR scan simulation)
- [ ] Location selection
- [ ] Public bins map
- [ ] Quiz functionality
- [ ] Profile management
- [ ] Navigation between screens

### 3. Test Permissions
- [ ] Camera access (for future features)
- [ ] Location access (for maps)
- [ ] Storage access (for images)

### 4. Test Security
- [ ] Input validation working
- [ ] No sensitive data in logs
- [ ] Secure storage functioning
- [ ] Rate limiting active

---

## Troubleshooting

### Build Fails
```bash
# Clear cache and retry
npx expo start --clear
eas build --platform android --profile preview --clear-cache
```

### APK Won't Install
1. Enable "Install from Unknown Sources" in Android settings
2. Check device has enough storage
3. Try downloading again

### Build Takes Too Long
- Normal build time: 10-15 minutes
- Check Expo status: https://status.expo.dev
- Try again during off-peak hours

### Credentials Issues
```bash
# Reset credentials
eas credentials

# Select platform and reset
```

---

## Distribution Options

### 1. Direct APK Distribution
**Pros:**
- No app store approval needed
- Instant distribution
- Full control

**Cons:**
- Users must enable "Unknown Sources"
- No automatic updates
- Manual distribution

**Best for:** Testing, internal use, beta testing

### 2. Google Play Store (Internal Testing)
```bash
# Build AAB for Play Store
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

**Pros:**
- Professional distribution
- Automatic updates
- No "Unknown Sources" needed

**Cons:**
- Requires Google Play Developer account ($25 one-time)
- Review process (usually 1-3 days)

### 3. TestFlight (iOS)
```bash
# Build for TestFlight
eas build --platform ios --profile production

# Submit to TestFlight
eas submit --platform ios
```

**Pros:**
- Official Apple testing platform
- Easy tester management
- Automatic updates

**Cons:**
- Requires Apple Developer account ($99/year)
- Review process

---

## Monitoring & Analytics

### Expo Dashboard
- View all builds
- Download APKs
- Check build logs
- Monitor crashes

**Access:** https://expo.dev/accounts/[your-account]/projects/greeniq

### Build Status
```bash
# Check build status
eas build:list

# View specific build
eas build:view [build-id]
```

---

## Security Best Practices

### ✅ Implemented
1. **Secure Storage:** Sensitive data encrypted
2. **Input Validation:** All inputs validated
3. **Sanitization:** XSS prevention
4. **Rate Limiting:** Abuse prevention
5. **HTTPS Only:** Secure communication
6. **No Hardcoded Secrets:** Environment variables
7. **Proper Permissions:** Minimal required permissions
8. **Error Handling:** No sensitive data in errors

### 🔒 Additional Recommendations
1. **SSL Pinning:** When adding backend API
2. **Code Obfuscation:** For production builds
3. **Jailbreak Detection:** Prevent running on rooted devices
4. **Biometric Auth:** Add fingerprint/face ID
5. **Session Management:** Implement timeout
6. **Audit Logging:** Track security events

---

## Quick Commands Reference

```bash
# Build Android APK (Preview)
eas build -p android --profile preview

# Build Android AAB (Production)
eas build -p android --profile production

# Build iOS (Development)
eas build -p ios --profile development

# Build iOS (Production)
eas build -p ios --profile production

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Download build
# Use link from build output or Expo dashboard

# Submit to stores
eas submit -p android
eas submit -p ios
```

---

## Next Steps After Build

### 1. Testing Phase
- Install on multiple devices
- Test all features thoroughly
- Gather feedback from team
- Fix any issues found

### 2. Beta Testing
- Distribute to beta testers
- Collect feedback
- Monitor crashes and errors
- Iterate and improve

### 3. Production Release
- Final testing
- Update app store listings
- Submit for review
- Launch! 🎉

---

## Support & Resources

### Expo Documentation
- Build: https://docs.expo.dev/build/introduction/
- Submit: https://docs.expo.dev/submit/introduction/
- Updates: https://docs.expo.dev/eas-update/introduction/

### Expo Status
- https://status.expo.dev

### Community
- Expo Forums: https://forums.expo.dev
- Discord: https://chat.expo.dev

---

## Summary

**To build and get APK + QR code:**

```bash
# 1. Install EAS CLI
npm install -g eas-cli

# 2. Login
eas login

# 3. Build
eas build --platform android --profile preview

# 4. Wait for build to complete (~10-15 min)

# 5. Get QR code and download link from output
```

**Security:** ✅ All security measures implemented
**Ready for:** Testing, beta distribution, production
**Platforms:** Android (APK ready), iOS (requires Apple account)

---

**Your app is secure and ready to build! 🚀**
