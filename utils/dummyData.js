// Dummy data for all API responses
export const dummyUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    ecoPoints: 1250,
    userRole: 'citizen',
    profileImage: 'https://via.placeholder.com/150',
    achievements: ['Recycler', 'Eco Warrior'],
    referralCode: 'JOHN123'
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    ecoPoints: 2100,
    userRole: 'citizen',
    profileImage: 'https://via.placeholder.com/150',
    achievements: ['Recycler', 'Eco Warrior', 'Green Champion'],
    referralCode: 'JANE456'
  },
  {
    _id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    ecoPoints: 1800,
    userRole: 'company',
    profileImage: 'https://via.placeholder.com/150',
    achievements: ['Recycler'],
    referralCode: 'MIKE789'
  }
];

export const dummyLeaderboard = {
  leaderBoard: [
    { rank: 1, name: 'Jane Smith', ecoPoints: 2100, profileImage: 'https://via.placeholder.com/150' },
    { rank: 2, name: 'Mike Johnson', ecoPoints: 1800, profileImage: 'https://via.placeholder.com/150' },
    { rank: 3, name: 'John Doe', ecoPoints: 1250, profileImage: 'https://via.placeholder.com/150' },
    { rank: 4, name: 'Sarah Williams', ecoPoints: 950, profileImage: 'https://via.placeholder.com/150' },
    { rank: 5, name: 'Tom Brown', ecoPoints: 850, profileImage: 'https://via.placeholder.com/150' }
  ]
};

export const dummyRewards = {
  message: [
    {
      _id: '1',
      name: 'Eco Tote Bag',
      description: 'Reusable shopping bag made from organic cotton',
      ecoPointsRequired: 500,
      image: 'https://via.placeholder.com/200',
      quantity: 50
    },
    {
      _id: '2',
      name: 'Bamboo Utensil Set',
      description: 'Eco-friendly bamboo cutlery set',
      ecoPointsRequired: 750,
      image: 'https://via.placeholder.com/200',
      quantity: 30
    },
    {
      _id: '3',
      name: 'Reusable Water Bottle',
      description: 'Stainless steel water bottle',
      ecoPointsRequired: 600,
      image: 'https://via.placeholder.com/200',
      quantity: 45
    },
    {
      _id: '4',
      name: 'Tree Planting Certificate',
      description: 'Plant a tree in your name',
      ecoPointsRequired: 1000,
      image: 'https://via.placeholder.com/200',
      quantity: 100
    }
  ]
};

export const dummyProductInfo = {
  code: '5901234123457',
  product: {
    name: 'Organic Cereal Box',
    brands: 'Nature\'s Best',
    categories: 'Breakfast Cereals',
    image_url: 'https://via.placeholder.com/300',
    ingredients_text: 'Oats, wheat, sugar, salt, vitamins',
    packaging: 'Cardboard box',
    nutriments: {
      energy_value: 380,
      fat: 3.5,
      carbohydrates: 78,
      protein: 8
    }
  }
};

export const dummyClassificationResult = {
  classification: 'Recyclable',
  confidence: 0.95,
  category: 'Paper/Cardboard',
  disposalTips: 'Remove any plastic windows, flatten the box, and place in your recycling bin.',
  ecoPointsEarned: 50,
  alternatives: [
    'Compost the cardboard if it\'s uncoated',
    'Reuse as storage or craft material'
  ]
};

export const dummyDeepSeekRecommendation = {
  recommendation: 'This cereal box is recyclable cardboard. Flatten and place in recycling. Eco-friendly alternatives: buy in bulk with reusable containers or choose brands using compostable packaging.',
  disposalMethod: 'Recyclable',
  ecoAlternatives: [
    'Buy cereal in bulk with reusable containers',
    'Choose brands with compostable packaging'
  ]
};

export const dummySafeZones = [
  {
    id: '1',
    name: 'Downtown Recycling Center',
    coords: { latitude: 40.7128, longitude: -74.0060 },
    address: '123 Main St, City Center',
    type: 'Recycling Center',
    distance: 2.5
  },
  {
    id: '2',
    name: 'Green Park Collection Point',
    coords: { latitude: 40.7580, longitude: -73.9855 },
    address: '456 Park Ave, Green District',
    type: 'Collection Point',
    distance: 1.8
  },
  {
    id: '3',
    name: 'Eco Hub Station',
    coords: { latitude: 40.7489, longitude: -73.9680 },
    address: '789 Eco Blvd, Sustainability Zone',
    type: 'Eco Hub',
    distance: 3.2
  }
];

export const dummyCollectionPoints = [
  {
    _id: '1',
    name: 'Central Waste Hub',
    location: 'Downtown',
    capacity: 1000,
    currentWaste: 650,
    acceptedTypes: ['Plastic', 'Paper', 'Metal', 'Glass'],
    status: 'Active'
  },
  {
    _id: '2',
    name: 'Suburban Collection',
    location: 'North District',
    capacity: 500,
    currentWaste: 320,
    acceptedTypes: ['Plastic', 'Paper', 'Organic'],
    status: 'Active'
  },
  {
    _id: '3',
    name: 'Industrial Waste Center',
    location: 'Industrial Zone',
    capacity: 2000,
    currentWaste: 1200,
    acceptedTypes: ['Metal', 'Plastic', 'Hazardous'],
    status: 'Active'
  }
];

export const dummyAchievements = [
  { id: '1', name: 'First Scan', description: 'Scan your first product', icon: '📱', unlocked: true },
  { id: '2', name: 'Recycler', description: 'Recycle 10 items', icon: '♻️', unlocked: true },
  { id: '3', name: 'Eco Warrior', description: 'Earn 500 eco points', icon: '⚔️', unlocked: true },
  { id: '4', name: 'Green Champion', description: 'Reach top 10 leaderboard', icon: '🏆', unlocked: false },
  { id: '5', name: 'Community Hero', description: 'Refer 5 friends', icon: '🦸', unlocked: false }
];

export const dummyUserProfile = {
  _id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1-555-0123',
  ecoPoints: 1250,
  totalScans: 45,
  itemsRecycled: 120,
  profileImage: 'https://via.placeholder.com/150',
  joinDate: '2023-01-15',
  achievements: ['Recycler', 'Eco Warrior'],
  referralCode: 'JOHN123',
  referralCount: 3
};

export const dummyCommunityPosts = [
  {
    _id: '1',
    author: 'Jane Smith',
    content: 'Just completed my 100th recycling scan! Feeling great about contributing to the environment.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    comments: 5,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '2',
    author: 'Mike Johnson',
    content: 'Found an amazing new recycling center near my office. Highly recommend!',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    likes: 18,
    comments: 3,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '3',
    author: 'Sarah Williams',
    content: 'Tips for reducing plastic waste at home: use reusable bags, bottles, and containers!',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    likes: 42,
    comments: 12,
    image: 'https://via.placeholder.com/300'
  }
];

export const dummyCompanyData = {
  _id: '1',
  name: 'EcoWaste Solutions',
  email: 'contact@ecowaste.com',
  employees: 25,
  wasteCollected: 5000,
  certifications: ['ISO 14001', 'B Corp Certified'],
  collectionPoints: 8,
  monthlyTarget: 10000,
  monthlyAchieved: 7500
};

export const dummyChatMessages = [
  { id: '1', sender: 'bot', text: 'Hello! How can I help you with waste management today?', timestamp: new Date() },
  { id: '2', sender: 'user', text: 'How do I recycle plastic?', timestamp: new Date() },
  { id: '3', sender: 'bot', text: 'Great question! Plastic recycling involves: 1) Check the recycling number (1-7), 2) Rinse containers, 3) Remove caps, 4) Place in recycling bin.', timestamp: new Date() }
];

export const dummyNotifications = [
  { id: '1', title: 'New Reward Available', message: 'You earned 100 eco points!', timestamp: new Date(), read: false },
  { id: '2', title: 'Collection Point Update', message: 'A new collection point opened near you', timestamp: new Date(Date.now() - 60 * 60 * 1000), read: false },
  { id: '3', title: 'Achievement Unlocked', message: 'You\'ve unlocked the Recycler badge!', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), read: true }
];
