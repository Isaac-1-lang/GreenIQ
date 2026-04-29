# Restart App to See Public Bins Map

## Quick Restart

Run this command to restart your app with the new Public Bins feature:

```bash
npx expo start --clear
```

Then press:
- **`a`** for Android
- **`i`** for iOS

---

## What to Test

### 1. Bottom Tab Bar
- Look for **"Public Bins"** tab (replaced "Safe Zones")
- Icon should be a **trash bin** (not shield)

### 2. Map Features
- **8 colored markers** across Kigali map
- **Filter chips** at top (All, Mixed Waste, Recyclables, Organic, E-Waste, Industrial)
- **Search bar** to find bins by location

### 3. Tap a Marker
You should see a card showing:
- Bin name and address
- Bin type badge (colored)
- Capacity bar with percentage
- Status (Available/Nearly Full)
- Accepted waste types (chips)
- Last emptied time
- "Get Directions" button
- Report icon (alert)

### 4. Test Interactions
- **Filter**: Tap different bin types to filter markers
- **Search**: Type location name (e.g., "Kimironko")
- **Directions**: Tap "Get Directions" → Opens Google Maps
- **Report**: Tap alert icon → Shows confirmation dialog
- **Locate Me**: Tap GPS icon in header → Centers on your location

---

## Navigation Paths to Public Bins

You can reach the Public Bins Map from:

1. **Bottom Tab Bar** → "Public Bins" tab
2. **Collection Points Screen** → Top right "Public Bins" button
3. **Company Portal** → "Bin Map" quick action

---

## Troubleshooting

### If you see "Safe Zones" instead of "Public Bins"
```bash
# Clear Metro cache completely
npx expo start --clear
# Then reload app (shake device → Reload)
```

### If map doesn't load
- Check internet connection (map tiles need to load)
- Grant location permissions when prompted

### If markers don't appear
- Zoom out to see all of Kigali
- Check if a filter is active (tap "All" to reset)

---

## Color Guide

- **Gray** = Mixed Waste (general trash)
- **Blue** = Recyclables (plastic, paper, glass)
- **Green** = Organic (food scraps, compost)
- **Orange** = E-Waste (electronics, batteries)
- **Red** = Industrial (construction, metal)

---

**Ready to test!** 🗑️♻️
