import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { quizQuestions, getQuizStreak } from '../utils/quizData';
import { UserContext } from '../context/UserContext';

const QuizScreen = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [totalEcoPoints, setTotalEcoPoints] = useState(0);

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const triggerPulse = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.05, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswerSelect = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = quizQuestions[currentQuestionIndex].options[index].isCorrect;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerPulse();
      const newScore = score + 1;
      const newStreak = streak + 1;
      const points = currentQuestion.ecoPoints;

      setScore(newScore);
      setStreak(newStreak);
      setTotalEcoPoints(totalEcoPoints + points);

      Toast.show({
        type: 'success',
        text1: '🎉 Correct!',
        text2: `+${points} Eco Points`,
        duration: 2000,
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      triggerShake();

      Toast.show({
        type: 'error',
        text1: '❌ Incorrect',
        text2: currentQuestion.explanation,
        duration: 3000,
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();

      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizComplete(true);

    // Award eco points to user
    if (user) {
      const updatedUser = {
        ...user,
        ecoPoints: (user.ecoPoints || 0) + totalEcoPoints,
      };
      setUser(updatedUser);
    }

    // Check for badge
    const badge = getQuizStreak(score);
    if (badge) {
      Toast.show({
        type: 'success',
        text1: `🏆 Badge Unlocked!`,
        text2: `You earned the "${badge.badge}" badge!`,
        duration: 3000,
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setQuizComplete(false);
    setTotalEcoPoints(0);
  };

  if (quizComplete) {
    const badge = getQuizStreak(score);
    const percentage = Math.round((score / quizQuestions.length) * 100);

    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.gradient}>
          <ScrollView contentContainerStyle={styles.completeContainer}>
            <View style={styles.resultCard}>
              <Ionicons
                name={percentage >= 70 ? 'checkmark-circle' : 'alert-circle'}
                size={80}
                color={percentage >= 70 ? '#00C896' : '#FF6B35'}
                style={{ marginBottom: 16 }}
              />

              <Text style={styles.resultTitle}>Quiz Complete!</Text>

              <View style={styles.scoreBox}>
                <Text style={styles.scoreText}>{score}</Text>
                <Text style={styles.scoreLabel}>out of {quizQuestions.length}</Text>
              </View>

              <Text style={styles.percentageText}>{percentage}%</Text>

              <View style={styles.pointsBox}>
                <Ionicons name="leaf" size={24} color="#00C896" />
                <Text style={styles.pointsText}>+{totalEcoPoints} Eco Points</Text>
              </View>

              {badge && (
                <View style={styles.badgeBox}>
                  <Ionicons name="medal" size={32} color="#FFD700" />
                  <Text style={styles.badgeText}>{badge.badge}</Text>
                </View>
              )}

              <Text style={styles.feedbackText}>
                {percentage >= 80
                  ? '🌟 Outstanding! You\'re an Eco Expert!'
                  : percentage >= 60
                  ? '👍 Great job! Keep learning!'
                  : '📚 Good effort! Review the explanations.'}
              </Text>

              <TouchableOpacity
                style={styles.restartButton}
                onPress={handleRestart}
              >
                <Text style={styles.restartButtonText}>Take Another Quiz</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.homeButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.homeButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#E0F7FA', '#B2EBF2']} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#1B5E20" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} / {quizQuestions.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.scoreDisplay}>
            <Ionicons name="leaf" size={20} color="#00C896" />
            <Text style={styles.scoreDisplayText}>{score}</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.questionCard,
              { transform: [{ translateX: shakeAnim }], opacity: fadeAnim },
            ]}
          >
            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>

            {/* Question */}
            <Text style={styles.question}>{currentQuestion.question}</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option.isCorrect;
                const showResult = answered && isSelected;

                let optionStyle = styles.option;
                let optionTextStyle = styles.optionText;

                if (showResult) {
                  if (isCorrect) {
                    optionStyle = [styles.option, styles.optionCorrect];
                    optionTextStyle = [styles.optionText, styles.optionTextCorrect];
                  } else {
                    optionStyle = [styles.option, styles.optionIncorrect];
                    optionTextStyle = [styles.optionText, styles.optionTextIncorrect];
                  }
                }

                return (
                  <TouchableOpacity
                    key={index}
                    style={optionStyle}
                    onPress={() => handleAnswerSelect(index)}
                    disabled={answered}
                    activeOpacity={0.7}
                  >
                    <View style={styles.optionContent}>
                      <View
                        style={[
                          styles.optionCircle,
                          isSelected && styles.optionCircleSelected,
                        ]}
                      >
                        {showResult && (
                          <Ionicons
                            name={isCorrect ? 'checkmark' : 'close'}
                            size={16}
                            color="#fff"
                          />
                        )}
                      </View>
                      <Text style={optionTextStyle}>{option.text}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Explanation */}
            {answered && (
              <View
                style={[
                  styles.explanationBox,
                  selectedAnswer !== null &&
                  quizQuestions[currentQuestionIndex].options[selectedAnswer]
                    .isCorrect
                    ? styles.explanationCorrect
                    : styles.explanationIncorrect,
                ]}
              >
                <Ionicons
                  name={
                    selectedAnswer !== null &&
                    quizQuestions[currentQuestionIndex].options[selectedAnswer]
                      .isCorrect
                      ? 'checkmark-circle'
                      : 'alert-circle'
                  }
                  size={20}
                  color={
                    selectedAnswer !== null &&
                    quizQuestions[currentQuestionIndex].options[selectedAnswer]
                      .isCorrect
                      ? '#00C896'
                      : '#FF6B35'
                  }
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.explanationText}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Next Button */}
        {answered && (
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === quizQuestions.length - 1
                ? 'Finish Quiz'
                : 'Next Question'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C896',
    borderRadius: 3,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreDisplayText: {
    marginLeft: 6,
    fontWeight: 'bold',
    color: '#00C896',
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00A8CC',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 20,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  optionCorrect: {
    backgroundColor: '#E8F5E9',
    borderColor: '#00C896',
  },
  optionIncorrect: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF6B35',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCircleSelected: {
    borderColor: '#00C896',
    backgroundColor: '#00C896',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  optionTextCorrect: {
    color: '#00C896',
  },
  optionTextIncorrect: {
    color: '#FF6B35',
  },
  explanationBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  explanationCorrect: {
    backgroundColor: '#E8F5E9',
  },
  explanationIncorrect: {
    backgroundColor: '#FFEBEE',
  },
  explanationText: {
    flex: 1,
    fontSize: 13,
    color: '#333',
    lineHeight: 20,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C896',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 3,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  completeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    elevation: 3,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  scoreBox: {
    alignItems: 'center',
    marginBottom: 12,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00C896',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  percentageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  pointsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  pointsText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C896',
  },
  badgeBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 8,
  },
  feedbackText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  restartButton: {
    backgroundColor: '#00C896',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  restartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#4ECDC4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuizScreen;
