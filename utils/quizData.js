// Kigali-specific waste management quiz questions
export const quizQuestions = [
  {
    id: 1,
    question: "You're at a picnic in Nyarutarama and have a leftover pizza box. Is it recyclable?",
    options: [
      { text: "Yes, always", isCorrect: false },
      { text: "Only if it's clean and dry", isCorrect: true },
      { text: "No, never", isCorrect: false },
      { text: "Only if it's from a specific restaurant", isCorrect: false },
    ],
    explanation: "Pizza boxes with grease stains can contaminate recycling. Clean, dry boxes are recyclable!",
    ecoPoints: 25,
    category: "Paper & Cardboard",
  },
  {
    id: 2,
    question: "What's the best way to dispose of plastic bags in Kigali?",
    options: [
      { text: "Throw in regular trash", isCorrect: false },
      { text: "Recycle with other plastics", isCorrect: false },
      { text: "Reuse or take to a collection point", isCorrect: true },
      { text: "Burn them", isCorrect: false },
    ],
    explanation: "Plastic bags jam recycling machines. Reuse them or take to designated collection points!",
    ecoPoints: 25,
    category: "Plastic",
  },
  {
    id: 3,
    question: "You have old electronics from Kicukiro. Where should they go?",
    options: [
      { text: "Regular trash bin", isCorrect: false },
      { text: "E-waste collection center", isCorrect: true },
      { text: "Compost bin", isCorrect: false },
      { text: "Recycling bin", isCorrect: false },
    ],
    explanation: "Electronics contain toxic materials. Take them to e-waste centers to prevent soil contamination!",
    ecoPoints: 30,
    category: "Electronics",
  },
  {
    id: 4,
    question: "What can you compost at home in Kigali?",
    options: [
      { text: "Meat and dairy", isCorrect: false },
      { text: "Fruit peels and vegetable scraps", isCorrect: true },
      { text: "Plastic and paper", isCorrect: false },
      { text: "All food waste", isCorrect: false },
    ],
    explanation: "Compost fruit/vegetable scraps, leaves, and grass. Avoid meat, dairy, and oils!",
    ecoPoints: 20,
    category: "Organic Waste",
  },
  {
    id: 5,
    question: "How often should you empty your home recycling bin?",
    options: [
      { text: "Daily", isCorrect: false },
      { text: "Weekly or when full", isCorrect: true },
      { text: "Monthly", isCorrect: false },
      { text: "Never, just keep adding", isCorrect: false },
    ],
    explanation: "Empty when full or weekly to prevent overflow and contamination!",
    ecoPoints: 15,
    category: "Recycling Habits",
  },
  {
    id: 6,
    question: "What's the symbol for recyclable plastic?",
    options: [
      { text: "Triangle with number 1-7", isCorrect: true },
      { text: "Circle with arrow", isCorrect: false },
      { text: "Green leaf", isCorrect: false },
      { text: "Bin symbol", isCorrect: false },
    ],
    explanation: "Look for the recycling triangle with numbers 1-7. Numbers 1 & 2 are most commonly recycled!",
    ecoPoints: 20,
    category: "Recycling Symbols",
  },
  {
    id: 7,
    question: "You find a broken glass bottle. What should you do?",
    options: [
      { text: "Put in recycling bin directly", isCorrect: false },
      { text: "Wrap in newspaper and label it", isCorrect: true },
      { text: "Throw in regular trash", isCorrect: false },
      { text: "Leave on the street", isCorrect: false },
    ],
    explanation: "Wrap broken glass to protect waste workers. Label it clearly for safety!",
    ecoPoints: 25,
    category: "Safety",
  },
  {
    id: 8,
    question: "Which is the most eco-friendly choice for shopping in Kigali?",
    options: [
      { text: "Plastic bags", isCorrect: false },
      { text: "Paper bags", isCorrect: false },
      { text: "Reusable cloth bags", isCorrect: true },
      { text: "Biodegradable bags", isCorrect: false },
    ],
    explanation: "Reusable bags reduce waste significantly. Use them for all your shopping!",
    ecoPoints: 20,
    category: "Sustainable Living",
  },
  {
    id: 9,
    question: "How long does a plastic bottle take to decompose?",
    options: [
      { text: "5-10 years", isCorrect: false },
      { text: "50-100 years", isCorrect: false },
      { text: "400+ years", isCorrect: true },
      { text: "Never fully decomposes", isCorrect: false },
    ],
    explanation: "Plastic bottles take 400+ years to decompose. Recycling is crucial!",
    ecoPoints: 15,
    category: "Environmental Impact",
  },
  {
    id: 10,
    question: "What's a 'collection point' in Kigali's waste system?",
    options: [
      { text: "Where trash is burned", isCorrect: false },
      { text: "A designated location to drop recyclables", isCorrect: true },
      { text: "A landfill", isCorrect: false },
      { text: "A compost facility", isCorrect: false },
    ],
    explanation: "Collection points are safe places to drop recyclables for proper processing!",
    ecoPoints: 20,
    category: "Community Resources",
  },
];

export const getQuizByCategory = (category) => {
  return quizQuestions.filter((q) => q.category === category);
};

export const getRandomQuiz = () => {
  return quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
};

export const getQuizStreak = (correctAnswers) => {
  if (correctAnswers >= 3) return { badge: "Knowledge Seeker", level: 1 };
  if (correctAnswers >= 7) return { badge: "Eco Scholar", level: 2 };
  if (correctAnswers >= 15) return { badge: "Waste Master", level: 3 };
  return null;
};
