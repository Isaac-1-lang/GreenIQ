# Fix for "Platform doesn't exist" Error

## The Problem
The error `ReferenceError: Property 'Platform' doesn't exist` is a Metro bundler caching issue that occurs after adding new files or modifying imports.

## Quick Fix (Choose One)

### Option 1: Clear Cache and Restart (Recommended)
```bash
# Stop the current Metro bundler (Ctrl+C)

# Clear cache and restart
npx expo start --clear
```

### Option 2: Manual Cache Clear
```bash
# Stop Metro bundler

# Delete cache folders
rmdir /s /q node_modules\.cache
rmdir /s /q .expo

# Restart
npx expo start
```

### Option 3: Use the Batch Script
```bash
# Run the provided script
restart-app.bat

# Then run
npx expo start --clear
```

## What Was Fixed

### 1. QuizScreen.js
- ✅ Removed non-existent theme import
- ✅ Removed unused StatusBar and Dimensions imports

### 2. App.js
- ✅ Added QuizScreen import
- ✅ Added Quiz route to navigation

### 3. Cache Issues
- ✅ Created restart script
- ✅ Documented cache clearing process

## After Restarting

Once Metro bundler restarts:
1. Press `a` for Android or `i` for iOS
2. The app should load without errors
3. You can now:
   - See Bin Buddy on HomeScreen
   - Tap Bin Buddy to open Quiz
   - Take the quiz and earn points
   - See Community Pulse feed

## If Error Persists

### Step 1: Check Node Modules
```bash
# Reinstall dependencies
npm install
# or
yarn install
```

### Step 2: Clear All Caches
```bash
# Clear npm cache
npm cache clean --force

# Clear watchman (if on Mac/Linux)
watchman watch-del-all

# Clear Metro cache
npx expo start --clear
```

### Step 3: Restart Device/Emulator
- Close and reopen your Android emulator or iOS simulator
- Or restart your physical device

## Verification

After restart, verify:
- [ ] App loads without errors
- [ ] HomeScreen displays
- [ ] BinBuddy is visible
- [ ] CommunityPulse is visible
- [ ] Tapping BinBuddy opens Quiz
- [ ] Quiz works correctly

## Common Issues

### Issue: "Cannot find module"
**Solution**: Run `npm install` or `yarn install`

### Issue: "Metro bundler won't start"
**Solution**: 
1. Kill all Node processes
2. Delete node_modules and reinstall
3. Clear all caches

### Issue: "App crashes on launch"
**Solution**:
1. Check console for specific error
2. Verify all imports are correct
3. Clear cache and restart

## Technical Details

The error occurs because:
1. Metro bundler caches module resolutions
2. When new files are added, cache becomes stale
3. Platform module resolution fails
4. Clearing cache forces fresh resolution

## Prevention

To avoid this in the future:
1. Always use `--clear` flag when adding new files
2. Restart Metro after major changes
3. Clear cache if you see import errors

---

**Quick Command Reference**

```bash
# Start with clear cache
npx expo start --clear

# Start normally
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios

# Clear everything
rm -rf node_modules .expo
npm install
npx expo start --clear
```

---

**Status**: All files fixed and ready. Just need to clear cache and restart!
