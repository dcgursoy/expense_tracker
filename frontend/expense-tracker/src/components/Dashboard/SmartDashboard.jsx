import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../services/aiService';
import analyticsService from '../../services/analyticsService';
import gamificationService from '../../services/gamificationService';
import predictiveService from '../../services/predictiveService';
import personalizationService from '../../services/personalizationService';
import { addThousandsSeparator } from '../../utils/helper';
import SavingsGoalModal from '../Modals/SavingsGoalModal';
import AchievementsModal from '../Modals/AchievementsModal';

const SmartDashboard = ({ expenses, income, userData }) => {
  const navigate = useNavigate();
  const [insights, setInsights] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [personality, setPersonality] = useState({});
  const [financialHealth, setFinancialHealth] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [upcomingBills, setUpcomingBills] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [showSavingsGoalModal, setShowSavingsGoalModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [updatedUserData, setUpdatedUserData] = useState(userData);

  useEffect(() => {
    if (expenses && income) {
      generateInsights();
      generatePredictions();
      detectAnomalies();
      checkAchievements();
      getChallenges();
      generateNotifications();
      analyzePersonality();
      calculateFinancialHealth();
      detectSubscriptions();
      predictBills();
      updateWelcomeMessage();
    }
  }, [expenses, income, userData]);

  const generateInsights = () => {
    const aiInsights = aiService.generateInsights(expenses, income);
    const analyticsInsights = analyticsService.generateRecommendations(expenses, income, userData?.goals);
    setInsights([...aiInsights, ...analyticsInsights]);
  };

  const generatePredictions = () => {
    const expensePredictions = aiService.predictExpenses(expenses);
    setPredictions(expensePredictions);
  };

  const detectAnomalies = () => {
    const detectedAnomalies = aiService.detectAnomalies(expenses);
    setAnomalies(detectedAnomalies);
  };

  const checkAchievements = () => {
    const userDataForGamification = {
      expenseCount: expenses.length,
      savingsRate: income > 0 ? ((income - expenses.reduce((sum, exp) => sum + exp.amount, 0)) / income) * 100 : 0,
      streak: userData?.currentStreak || 0,
      budgetStreak: userData?.budgetStreak || 0,
      categoryCount: new Set(expenses.map(exp => exp.category)).size,
      earlyLogs: expenses.filter(exp => new Date(exp.date).getHours() < 9).length,
      noImpulseDays: userData?.noImpulseDays || 0,
      achievements: userData?.achievements || [],
      totalPoints: userData?.totalPoints || 0,
      lastActivity: userData?.lastActivity || new Date().toISOString()
    };

    const newAchievements = gamificationService.checkAchievements(userDataForGamification);
    setAchievements(newAchievements);
    
    // Update user data with new achievements and points
    if (newAchievements.length > 0) {
      const totalNewPoints = newAchievements.reduce((sum, achievement) => sum + achievement.points, 0);
      const newUserData = {
        ...userData,
        achievements: [...(userData?.achievements || []), ...newAchievements.map(a => a.id)],
        totalPoints: (userData?.totalPoints || 0) + totalNewPoints
      };
      setUpdatedUserData(newUserData);
      // In a real app, you would save this to the backend
      console.log('New achievements earned:', newAchievements);
      console.log('Updated user data:', newUserData);
    }
  };

  const getChallenges = () => {
    const userDataForChallenges = {
      coffeePurchases: expenses.some(exp => exp.description?.toLowerCase().includes('coffee')),
      noCoffeeDays: userData?.noCoffeeDays || 0,
      groceryReduction: userData?.groceryReduction || 0,
      weekendSpending: expenses.filter(exp => {
        const day = new Date(exp.date).getDay();
        return day === 0 || day === 6;
      }).reduce((sum, exp) => sum + exp.amount, 0),
      noOnlineShopping: userData?.noOnlineShopping || 0,
      activeChallenges: userData?.activeChallenges || []
    };

    const challengeProgress = gamificationService.getChallengeProgress(userDataForChallenges);
    setChallenges(challengeProgress);
  };

  const generateNotifications = () => {
    // Calculate actual savings rate
    const actualSavingsRate = income > 0 ? ((income - expenses.reduce((sum, exp) => sum + exp.amount, 0)) / income) * 100 : 0;
    
    // Create user data with correct income for notifications
    const userDataForNotifications = {
      ...userData,
      monthlyIncome: income,
      savingsRate: actualSavingsRate
    };
    
    const smartNotifications = predictiveService.generateSmartNotifications(userDataForNotifications, expenses);
    const gamificationNotifications = gamificationService.getPersonalizedRecommendations(userData);
    setNotifications([...smartNotifications, ...gamificationNotifications]);
  };

  const analyzePersonality = () => {
    const personalityAnalysis = analyticsService.analyzeSpendingPersonality(expenses, income);
    setPersonality(personalityAnalysis);
  };

  const calculateFinancialHealth = () => {
    const score = analyticsService.calculateFinancialHealthScore(
      expenses,
      income,
      userData?.savings || 0,
      userData?.monthlyBudget || income
    );
    setFinancialHealth(score);
  };

  const detectSubscriptions = () => {
    const detectedSubs = predictiveService.detectSubscriptions(expenses);
    setSubscriptions(detectedSubs);
  };

  const predictBills = () => {
    const upcoming = predictiveService.predictUpcomingBills(expenses, 30);
    setUpcomingBills(upcoming);
  };

  const updateWelcomeMessage = () => {
    const message = personalizationService.getWelcomeMessage(userData);
    setWelcomeMessage(message);
  };

  // Handle notification actions
  const handleNotificationAction = (notification) => {
    switch (notification.type) {
      case 'budget_warning':
        navigate('/expense'); // Navigate to expense page to review budget
        break;
      case 'savings_reminder':
        setShowSavingsGoalModal(true); // Open savings goal modal
        break;
      case 'achievement':
        setShowAchievementsModal(true); // Open achievements modal
        break;
      case 'challenge':
        // Open challenges modal or navigate to challenges page
        console.log('Opening challenges modal');
        // For now, show a simple alert with available challenges
        const availableChallenges = gamificationService.challenges;
        const challengeList = availableChallenges.map(c => `• ${c.title}: ${c.description}`).join('\n');
        alert(`Available Challenges:\n\n${challengeList}\n\nThis feature will be fully implemented soon!`);
        break;
      case 'bill_reminder':
        // Mark bill as paid or navigate to bills page
        console.log('Marking bill as paid:', notification.data);
        break;
      case 'spending_alert':
        navigate('/expense'); // Navigate to expense page to review spending
        break;
      case 'motivation':
        // Share achievement or show motivation message
        console.log('Sharing achievement');
        break;
      case 'reminder':
        navigate('/expense'); // Navigate to add expense
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      {welcomeMessage && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{welcomeMessage}</h2>
          <p className="text-gray-600">Here's your personalized financial overview</p>
        </div>
      )}

      {/* Financial Health Score */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Financial Health Score</h3>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreBg(financialHealth)} ${getHealthScoreColor(financialHealth)}`}>
            {financialHealth}/100
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              financialHealth >= 80 ? 'bg-green-500' : 
              financialHealth >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${financialHealth}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {financialHealth >= 80 ? 'Excellent! Keep up the great work!' :
           financialHealth >= 60 ? 'Good! There\'s room for improvement.' :
           'Let\'s work on improving your financial health.'}
        </p>
      </div>

      {/* Personality Analysis */}
      {personality.type && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Spending Personality</h3>
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">
              {personality.type === 'Saver' && '💰'}
              {personality.type === 'Spender' && '🛍️'}
              {personality.type === 'Planner' && '📊'}
              {personality.type === 'Balancer' && '⚖️'}
            </div>
            <div>
              <h4 className="font-medium text-gray-800">{personality.type}</h4>
              <p className="text-sm text-gray-600">{personality.traits.join(', ')}</p>
            </div>
          </div>
          {personality.recommendations.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Recommendations:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                {personality.recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span className="cursor-pointer hover:text-purple-600 transition-colors duration-200" 
                          onClick={() => {
                            if (rec.includes('investing')) {
                              console.log('Opening investment options');
                            } else if (rec.includes('automating')) {
                              console.log('Opening automation settings');
                            } else if (rec.includes('tracking')) {
                              navigate('/expense');
                            } else if (rec.includes('emergency fund')) {
                              console.log('Opening emergency fund setup');
                            }
                          }}>
                      {rec}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      {insights.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">AI Insights</h3>
          <div className="space-y-3">
            {insights.slice(0, 3).map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                insight.type === 'warning' ? 'bg-red-50 border-red-400' :
                insight.type === 'info' ? 'bg-blue-50 border-blue-400' :
                'bg-green-50 border-green-400'
              }`}>
                <h4 className="font-medium text-gray-800">{insight.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
                {insight.action && (
                  <button 
                    onClick={() => {
                      if (insight.type === 'savings') {
                        console.log('Opening savings settings');
                      } else if (insight.type === 'category') {
                        navigate('/expense');
                      } else if (insight.type === 'budget') {
                        navigate('/expense');
                      }
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 mt-2 font-medium cursor-pointer transition-colors duration-200 hover:underline"
                  >
                    {insight.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🎉 New Achievements!</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-medium text-gray-800">{achievement.title}</h4>
                  <p className="text-sm text-gray-600">{achievement.description}</p>
                  <p className="text-xs text-purple-600 font-medium">+{achievement.points} points</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Challenges */}
      {challenges.filter(c => c.active).length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Challenges</h3>
          <div className="space-y-3">
            {challenges.filter(c => c.active).map((challenge, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{challenge.icon}</span>
                    <h4 className="font-medium text-gray-800">{challenge.title}</h4>
                  </div>
                  <span className="text-sm text-gray-600">{challenge.reward} pts</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{challenge.description}</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{Math.round(challenge.progress)}% complete</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bills */}
      {upcomingBills.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📅 Upcoming Bills</h3>
          <div className="space-y-2">
            {upcomingBills.slice(0, 5).map((bill, index) => (
              <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{bill.name}</h4>
                  <p className="text-sm text-gray-600">
                    Due: {new Date(bill.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${bill.amount}</p>
                  <p className="text-xs text-gray-500">{bill.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subscriptions */}
      {subscriptions.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔗 Active Subscriptions</h3>
          <div className="space-y-2">
            {subscriptions.map((sub, index) => (
              <div key={index} className="flex items-center justify-between p-2 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{sub.name}</h4>
                  <p className="text-sm text-gray-600">{sub.frequency}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800">${sub.amount}</p>
                  <p className={`text-xs ${
                    sub.status === 'due_soon' ? 'text-red-500' :
                    sub.status === 'upcoming' ? 'text-yellow-500' : 'text-green-500'
                  }`}>
                    {sub.status.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Anomalies */}
      {anomalies.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">⚠️ Unusual Spending</h3>
          <div className="space-y-2">
            {anomalies.slice(0, 3).map((anomaly, index) => (
              <div key={index} className="p-2 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800">{anomaly.category}</h4>
                    <p className="text-sm text-gray-600">
                      ${anomaly.amount} (avg: ${anomaly.average})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-red-600">
                      {anomaly.severity.toFixed(1)}x higher
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Notifications */}
      {notifications.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">🔔 Smart Alerts</h3>
          <div className="space-y-2">
            {notifications.slice(0, 3).map((notification, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                notification.priority === 'high' ? 'bg-red-50 border-red-400' :
                notification.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <h4 className="font-medium text-gray-800">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                {notification.action && (
                  <button 
                    onClick={() => handleNotificationAction(notification)}
                    className="text-sm text-purple-600 hover:text-purple-700 mt-2 font-medium cursor-pointer transition-colors duration-200 hover:underline"
                  >
                    {notification.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <SavingsGoalModal
        isOpen={showSavingsGoalModal}
        onClose={() => setShowSavingsGoalModal(false)}
        currentSavingsRate={((income - expenses.reduce((sum, exp) => sum + exp.amount, 0)) / income) * 100}
        onSave={(goal) => {
          console.log('Savings goal set:', goal);
          // Here you would typically save to backend
          // For now, just log the goal
        }}
      />

      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        userData={{
          ...updatedUserData,
          expenseCount: expenses.length,
          savingsRate: income > 0 ? ((income - expenses.reduce((sum, exp) => sum + exp.amount, 0)) / income) * 100 : 0,
          categoryCount: new Set(expenses.map(exp => exp.category)).size,
          earlyLogs: expenses.filter(exp => new Date(exp.date).getHours() < 9).length,
          achievements: updatedUserData?.achievements || userData?.achievements || [],
          totalPoints: updatedUserData?.totalPoints || userData?.totalPoints || 0,
          currentStreak: userData?.currentStreak || 0,
          budgetStreak: userData?.budgetStreak || 0,
          noImpulseDays: userData?.noImpulseDays || 0
        }}
      />
    </div>
  );
};

export default SmartDashboard; 