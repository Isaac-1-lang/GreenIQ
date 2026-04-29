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
  const scaleAnims = useRef(quizQuestions[0].options.map(() => new Animated.Value(1))).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Add more dynamic animations for completion
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 80, useNativeDriver: true }),
    ]).start();
  };

  const triggerPulse = (index) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.spring(scaleAnims[index], { toValue: 1.02, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnims[index], { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
  };

  const handleAnswerSelect = (index) => {
    if (answered) return;

    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = quizQuestions[currentQuestionIndex].options[index].isCorrect;

    if (isCorrect) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      triggerPulse(index);
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
        position: 'bottom',
      });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      triggerShake();

      Toast.show({
        type: 'error',
        text1: '❌ Incorrect',
        text2: currentQuestion.explanation,
        duration: 3000,
        position: 'bottom',
      });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
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
    
    Animated.spring(bounceAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();

    if (user) {
      const updatedUser = {
        ...user,
        ecoPoints: (user.ecoPoints || 0) + totalEcoPoints,
      };
      setUser(updatedUser);
    }

    const badge = getQuizStreak(score);
    if (badge) {
      Toast.show({
        type: 'success',
        text1: `🏆 Badge Unlocked!`,
        text2: `You earned the "${badge.badge}" badge!`,
        duration: 3000,
        position: 'top',
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
    bounceAnim.setValue(0);
  };

  if (quizComplete) {
    const badge = getQuizStreak(score);
    const percentage = Math.round((score / quizQuestions.length) * 100);
    const isSuccess = percentage >= 70;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <LinearGradient colors={isSuccess ? ['#ECFDF5', '#D1FAE5'] : ['#FEF2F2', '#FEE2E2']} style={styles.gradient}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.completeContainer}>
              <Animated.View style={[styles.resultCard, {
                transform: [
                  { translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [100, 0] }) },
                  { scale: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }
                ],
                opacity: bounceAnim
              }]}>
                <View style={[styles.iconBgResult, { backgroundColor: isSuccess ? '#D1FAE5' : '#FEE2E2' }]}>
                  <Ionicons name={isSuccess ? 'trophy' : 'refresh'} size={64} color={isSuccess ? '#00C896' : '#FF6B35'} />
                </View>

                <Text style={styles.resultTitle}>{isSuccess ? 'Quiz Conquered!' : 'Quiz Complete!'}</Text>

                <View style={styles.scoreRow}>
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>{score}</Text>
                    <Text style={styles.scoreLabel}>Out of {quizQuestions.length}</Text>
                  </View>
                  <View style={styles.scoreDivider} />
                  <View style={styles.scoreBox}>
                    <Text style={[styles.scoreText, { color: isSuccess ? '#00C896' : '#FF6B35' }]}>{percentage}%</Text>
                    <Text style={styles.scoreLabel}>Accuracy</Text>
                  </View>
                </View>

                <View style={styles.pointsEarnedBox}>
                  <Ionicons name="leaf" size={24} color="#00C896" />
                  <Text style={styles.pointsEarnedText}>+{totalEcoPoints} Eco Points Earned</Text>
                </View>

                {badge && (
                  <View style={styles.badgeBox}>
                    <Ionicons name="medal" size={24} color="#F59E0B" style={{marginRight: 8}} />
                    <Text style={styles.badgeText}>Unlocked: {badge.badge}</Text>
                  </View>
                )}

                <Text style={styles.feedbackText}>
                  {percentage >= 80 ? '🌟 Outstanding! You\'re an Eco Expert!' : percentage >= 60 ? '👍 Great job! Keep learning!' : '📚 Good effort! Review the explanations.'}
                </Text>

                <TouchableOpacity style={[styles.primaryButton, {backgroundColor: isSuccess ? '#00C896' : '#1B5E20'}]} onPress={handleRestart}>
                  <Text style={styles.primaryButtonText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
                  <Text style={styles.secondaryButtonText}>Return to Home</Text>
                </TouchableOpacity>
              </Animated.View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="close" size={28} color="#1B5E20" />
          </TouchableOpacity>

          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question <Text style={{fontWeight: '800', color: '#1B5E20'}}>{currentQuestionIndex + 1}</Text> of {quizQuestions.length}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View style={[styles.progressFill, { width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }]} />
            </View>
          </View>

          <View style={styles.scoreDisplay}>
            <Ionicons name="leaf" size={16} color="#00C896" />
            <Text style={styles.scoreDisplayText}>{score}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View style={[styles.questionCard, { transform: [{ translateX: shakeAnim }], opacity: fadeAnim }]}>
            
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>

            <Text style={styles.question}>{currentQuestion.question}</Text>

            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = option.isCorrect;
                const showResult = answered && isSelected;
                
                // Let's also show correct answers if wrong was chosen
                const showCorrectAnswer = answered && !isSelected && isCorrect && selectedAnswer !== null;

                let optionStyle = styles.option;
                let optionTextStyle = styles.optionText;
                let circleColor = '#999';
                let circleIcon = null;

                if (showResult || showCorrectAnswer) {
                  if (isCorrect) {
                    optionStyle = [styles.option, styles.optionCorrect];
                    optionTextStyle = [styles.optionText, styles.optionTextCorrect];
                    circleColor = '#00C896';
                    circleIcon = 'checkmark';
                  } else if (showResult) {
                    optionStyle = [styles.option, styles.optionIncorrect];
                    optionTextStyle = [styles.optionText, styles.optionTextIncorrect];
                    circleColor = '#FF6B35';
                    circleIcon = 'close';
                  }
                } else if (isSelected) {
                  optionStyle = [styles.option, styles.optionSelected];
                }

                return (
                  <Animated.View key={index} style={{ transform: [{ scale: scaleAnims[index] || 1 }] }}>
                    <TouchableOpacity
                      style={optionStyle}
                      onPress={() => handleAnswerSelect(index)}
                      disabled={answered}
                      activeOpacity={0.7}
                    >
                      <View style={styles.optionContent}>
                        <View style={[styles.optionCircle, { borderColor: circleColor, backgroundColor: circleIcon ? circleColor : 'transparent' }]}>
                          {circleIcon && <Ionicons name={circleIcon} size={16} color="#fff" />}
                        </View>
                        <Text style={optionTextStyle}>{option.text}</Text>
                      </View>
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>

            {/* Explanation box */}
            {answered && (
              <Animated.View style={[styles.explanationBox, { opacity: fadeAnim }]}>
                <Ionicons
                  name={quizQuestions[currentQuestionIndex].options[selectedAnswer]?.isCorrect ? 'bulb' : 'information-circle'}
                  size={20}
                  color="#00C896"
                  style={{ marginRight: 8, marginTop: 2 }}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.explanationTitle}>Did you know?</Text>
                  <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>

        {/* Footer actions */}
        <View style={styles.footer}>
          {answered ? (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext} activeOpacity={0.8}>
              <Text style={styles.nextButtonText}>
                {currentQuestionIndex === quizQuestions.length - 1 ? 'See Results' : 'Next Question'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={styles.footerHint}>
              <Text style={styles.footerHintText}>Select an answer to continue</Text>
            </View>
          )}
        </View>

      </SafeAreaView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
  },
  safeArea: {
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
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00C896',
    borderRadius: 4,
  },
  scoreDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  scoreDisplayText: {
    marginLeft: 6,
    fontWeight: '800',
    color: '#00A578',
    fontSize: 14,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0284C7',
    textTransform: 'uppercase',
  },
  question: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 20,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 12,
  },
  option: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  optionSelected: {
    borderColor: '#00C896',
    backgroundColor: '#F8FAFC',
  },
  optionCorrect: {
    backgroundColor: '#ECFDF5',
    borderColor: '#00C896',
  },
  optionIncorrect: {
    backgroundColor: '#FEF2F2',
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
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '600',
  },
  optionTextCorrect: {
    color: '#00A578',
  },
  optionTextIncorrect: {
    color: '#FF6B35',
  },
  explanationBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  explanationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00A578',
    marginBottom: 4,
  },
  explanationText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00C896',
    paddingVertical: 18,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginRight: 8,
  },
  footerHint: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  footerHintText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  // Complete Screen Styles
  completeContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  iconBgResult: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1B5E20',
    marginBottom: 20,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 20,
  },
  scoreBox: {
    alignItems: 'center',
    flex: 1,
  },
  scoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  scoreText: {
    fontSize: 40,
    fontWeight: '900',
    color: '#1B5E20',
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  pointsEarnedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 16,
  },
  pointsEarnedText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#00C896',
  },
  badgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B45309',
  },
  feedbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
    lineHeight: 24,
  },
  primaryButton: {
    paddingVertical: 18,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default QuizScreen;
