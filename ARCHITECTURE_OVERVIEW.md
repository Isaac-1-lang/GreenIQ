# GreenIQ Emotional Interactivity - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        HomeScreen                               │
│  (Main Hub - Shows all emotional interactivity features)        │
└─────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │  BinBuddy    │ │Community     │ │Quick Links   │
        │  Component   │ │Pulse         │ │(Scan, etc)   │
        │              │ │Component     │ │              │
        └──────────────┘ └──────────────┘ └──────────────┘
                │
                │ (Tap to navigate)
                ▼
        ┌──────────────┐
        │ QuizScreen   │
        │              │
        │ • 10 Qs      │
        │ • Scoring    │
        │ • Badges     │
        └──────────────┘
                │
                │ (Updates on completion)
                ▼
        ┌──────────────┐
        │ UserContext  │
        │              │
        │ • EcoPoints  │
        │ • Badges     │
        │ • Streak     │
        └──────────────┘
```

---

## Component Hierarchy

```
HomeScreen
├── BinBuddy
│   ├── Animated.View (bounce/shake)
│   ├── Fill Level Indicator
│   ├── Emotion Display (emoji)
│   └── Status Text
│
├── CommunityPulse
│   ├── Header (with pulse dot)
│   ├── ScrollView (horizontal)
│   │   └── StoryCard (repeating)
│   │       ├── Icon
│   │       ├── Location
│   │       ├── Action
│   │       └── HighFiveButton
│   └── StatsContainer
│       ├── StatItem (Active Users)
│       ├── StatItem (Waste Diverted)
│       └── StatItem (Weekly Growth)
│
└── QuickLinks
    ├── Scan
    ├── Badges
    ├── Stats
    └── Community
```

---

## Data Flow

```
User Interaction
       │
       ▼
┌─────────────────────────────────────────┐
│  BinBuddy Tap                           │
│  - Trigger pulse animation              │
│  - Haptic feedback                      │
│  - Navigate to Quiz                     │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  QuizScreen                             │
│  - Load question from quizData.js       │
│  - Display options                      │
│  - Wait for user selection              │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Answer Selection                       │
│  - Check if correct                     │
│  - Trigger animation (correct/wrong)    │
│  - Calculate EcoPoints                  │
│  - Update streak                        │
│  - Show toast notification              │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Quiz Completion                        │
│  - Calculate total score                │
│  - Check for badge unlock               │
│  - Update UserContext                   │
│  - Award EcoPoints                      │
│  - Show completion screen               │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  UserContext Updated                    │
│  - ecoPoints += earned                  │
│  - badges updated                       │
│  - streak incremented                   │
│  - persisted across sessions            │
└─────────────────────────────────────────┘
```

---

## File Structure

```
GreenIQ/
├── components/
│   ├── BinBuddy.js                    # Emotional bin avatar
│   ├── CommunityPulse.js              # Community live feed
│   ├── CustomButton.js
│   ├── CustomTextInput.js
│   └── WasteClassificationModal.js
│
├── screens/
│   ├── HomeScreen.js                  # ✨ UPDATED - Added BinBuddy & CommunityPulse
│   ├── QuizScreen.js                  # ✨ NEW - Interactive quiz engine
│   ├── LoginScreen.js
│   ├── RegisterScreen.js
│   ├── ProfileScreen.js
│   ├── Rewards.js
│   ├── Leaderboard.js
│   ├── ProductScanScreen.js
│   ├── ScanScreen.js
│   ├── SafeZonesMap.js
│   ├── ReferralScreen.js
│   ├── CompanyPortal.js
│   └── ... (other screens)
│
├── utils/
│   ├── quizData.js                    # ✨ NEW - 10 Kigali-specific questions
│   ├── dummyData.js
│   ├── DeepSeekAnalysis.js
│   ├── ProductGrade.js
│   ├── cleanText.js
│   ├── extractYoutubeURL.js
│   └── validators.js
│
├── context/
│   └── UserContext.js                 # ✨ USED - Updated on quiz completion
│
├── navigation/
│   └── AppNavigator.js                # ✨ UPDATED - Added Quiz route
│
├── styles/
│   ├── globalStyles.js
│   └── styles.js
│
├── services/
│   └── auth.js
│
├── assets/
│   └── ... (images)
│
└── Documentation/
    ├── EMOTIONAL_INTERACTIVITY_GUIDE.md
    ├── HULT_PRIZE_FEATURES.md
    ├── INTEGRATION_CHECKLIST.md
    ├── ARCHITECTURE_OVERVIEW.md (this file)
    ├── INTEGRATION_REMOVAL_SUMMARY.md
    └── ... (other docs)
```

---

## State Management Flow

```
┌─────────────────────────────────────────┐
│         UserContext (Global)            │
│                                         │
│  {                                      │
│    user: {                              │
│      name: string                       │
│      email: string                      │
│      ecoPoints: number  ◄─── Updated   │
│      badges: array      ◄─── Updated   │
│      streak: number     ◄─── Updated   │
│    },                                   │
│    setUser: function                    │
│  }                                      │
└─────────────────────────────────────────┘
         ▲
         │ (Updates from QuizScreen)
         │
┌─────────────────────────────────────────┐
│         QuizScreen (Local)              │
│                                         │
│  {                                      │
│    currentQuestionIndex: number         │
│    selectedAnswer: number               │
│    answered: boolean                    │
│    score: number                        │
│    streak: number                       │
│    quizComplete: boolean                │
│    totalEcoPoints: number               │
│  }                                      │
└─────────────────────────────────────────┘
```

---

## Animation Pipeline

```
User Interaction
       │
       ▼
┌─────────────────────────────────────────┐
│  Haptics.impactAsync()                  │
│  - Vibration feedback                   │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Animated.timing() / Animated.sequence()│
│  - Scale, rotate, translate             │
│  - Runs on native thread (60fps)        │
└─────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────┐
│  Toast.show()                           │
│  - Notification display                 │
└─────────────────────────────────────────┘
```

---

## Quiz Logic Flow

```
Start Quiz
    │
    ▼
Load Question (from quizData.js)
    │
    ├─ Display question text
    ├─ Display 4 options
    └─ Wait for selection
    │
    ▼
User Selects Answer
    │
    ├─ Check if correct
    │
    ├─ IF CORRECT:
    │  ├─ Trigger pulse animation
    │  ├─ Success haptic feedback
    │  ├─ Add EcoPoints
    │  ├─ Increment streak
    │  └─ Show toast: "+25 Eco Points"
    │
    └─ IF INCORRECT:
       ├─ Trigger shake animation
       ├─ Warning haptic feedback
       ├─ Show explanation
       └─ No points awarded
    │
    ▼
Show Explanation
    │
    ▼
User Taps "Next"
    │
    ├─ IF more questions:
    │  └─ Load next question
    │
    └─ IF last question:
       └─ Show completion screen
    │
    ▼
Quiz Complete
    │
    ├─ Calculate total score
    ├─ Check for badge unlock
    ├─ Update UserContext
    ├─ Award EcoPoints
    └─ Show results
```

---

## Performance Optimization

```
┌─────────────────────────────────────────┐
│  Lightweight Animations                 │
│  - React Native Animated API            │
│  - No Lottie (heavy library)            │
│  - Runs on native thread                │
│  - 60fps on mid-range devices           │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Efficient Rendering                    │
│  - React.memo for components            │
│  - Animations only on interaction       │
│  - No unnecessary re-renders            │
│  - Local data (no API calls)            │
└─────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Device Compatibility                   │
│  - Android 8.0+                         │
│  - iOS 12.0+                            │
│  - 1GB-2GB RAM devices                  │
│  - Tested on mid-range phones           │
└─────────────────────────────────────────┘
```

---

## Integration Points

### 1. HomeScreen Integration
```javascript
// Import components
import BinBuddy from '../components/BinBuddy';
import CommunityPulse from '../components/CommunityPulse';

// Render in ScrollView
<BinBuddy fillPercentage={45} onPress={() => navigation.navigate('Quiz')} />
<CommunityPulse />
```

### 2. Navigation Integration
```javascript
// AppNavigator.js
import QuizScreen from '../screens/QuizScreen';

<Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
```

### 3. UserContext Integration
```javascript
// QuizScreen.js
const { user, setUser } = useContext(UserContext);

// On completion
const updatedUser = {
  ...user,
  ecoPoints: (user.ecoPoints || 0) + totalEcoPoints,
};
setUser(updatedUser);
```

---

## Psychological Principles Applied

```
┌─────────────────────────────────────────┐
│  BinBuddy                               │
│  Principle: Digital Empathy             │
│  Effect: Emotional attachment           │
│  Result: Intrinsic motivation           │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Quiz Engine                            │
│  Principle: Scenario-Based Learning     │
│  Effect: Memorable, relevant education  │
│  Result: Behavior change                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Community Pulse                        │
│  Principle: Social Proof + FOMO         │
│  Effect: Community identity & urgency   │
│  Result: Sustained engagement           │
└─────────────────────────────────────────┘
```

---

## Scalability Path

```
Phase 1 (Current)
├─ Local quiz data
├─ Dummy community stories
└─ Local UserContext

Phase 2 (Backend Integration)
├─ Real-time community feed API
├─ Leaderboard sync
└─ Badge persistence

Phase 3 (Advanced Features)
├─ Seasonal challenges
├─ Social sharing
└─ Multiplayer quizzes

Phase 4 (AI & AR)
├─ AI-powered recommendations
├─ AR Bin Buddy
└─ Predictive analytics
```

---

## Testing Strategy

```
Unit Tests
├─ BinBuddy animations
├─ Quiz logic
└─ Community Pulse rendering

Integration Tests
├─ HomeScreen with all components
├─ Navigation flow
└─ UserContext updates

Device Tests
├─ Android mid-range
├─ iOS mid-range
└─ Performance metrics

User Tests
├─ Engagement metrics
├─ Completion rates
└─ User feedback
```

---

## Success Metrics

```
Engagement
├─ Quiz completion rate
├─ Daily active users
└─ Time spent in app

Learning
├─ Average quiz score
├─ Badge unlock rate
└─ Knowledge retention

Community
├─ High-five engagement
├─ Community participation
└─ Social sharing rate

Impact
├─ EcoPoints earned
├─ Behavior change
└─ Waste diverted
```

---

**Built for the Hult Prize - Transforming GreenIQ into a Movement** 🌍♻️

*Architecture designed for scalability, performance, and psychological impact.*
