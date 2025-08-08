// Gamification Service for engagement features
class GamificationService {
  constructor() {
    this.achievements = [
      {
        id: 'first_expense',
        title: 'First Step',
        description: 'Added your first expense',
        icon: '🎯',
        points: 10,
        condition: (data) => data.expenseCount >= 1
      },
      {
        id: 'savings_master',
        title: 'Savings Master',
        description: 'Achieved 20% savings rate',
        icon: '💰',
        points: 50,
        condition: (data) => data.savingsRate >= 20
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: '7-day tracking streak',
        icon: '🔥',
        points: 25,
        condition: (data) => data.streak >= 7
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: '30-day tracking streak',
        icon: '🏆',
        points: 100,
        condition: (data) => data.streak >= 30
      },
      {
        id: 'budget_keeper',
        title: 'Budget Keeper',
        description: 'Stayed under budget for 3 months',
        icon: '📊',
        points: 75,
        condition: (data) => data.budgetStreak >= 3
      },
      {
        id: 'category_explorer',
        title: 'Category Explorer',
        description: 'Used 8 different expense categories',
        icon: '🗂️',
        points: 30,
        condition: (data) => data.categoryCount >= 8
      },
      {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Logged expenses before 9 AM',
        icon: '🌅',
        points: 15,
        condition: (data) => data.earlyLogs >= 5
      },
      {
        id: 'no_impulse',
        title: 'Impulse Controller',
        description: 'No impulse purchases for 2 weeks',
        icon: '🧠',
        points: 40,
        condition: (data) => data.noImpulseDays >= 14
      }
    ];

    this.challenges = [
      {
        id: 'no_coffee_week',
        title: 'No Coffee Week',
        description: 'Skip coffee shop purchases for 7 days',
        duration: 7,
        reward: 50,
        icon: '☕',
        condition: (data) => !data.coffeePurchases,
        progress: (data) => Math.min(100, (data.noCoffeeDays / 7) * 100)
      },
      {
        id: 'grocery_saver',
        title: 'Grocery Saver',
        description: 'Reduce grocery spending by 25%',
        duration: 30,
        reward: 75,
        icon: '🛒',
        condition: (data) => data.groceryReduction >= 25,
        progress: (data) => Math.min(100, (data.groceryReduction / 25) * 100)
      },
      {
        id: 'weekend_saver',
        title: 'Weekend Saver',
        description: 'Spend less than $50 on weekends',
        duration: 4,
        reward: 30,
        icon: '📅',
        condition: (data) => data.weekendSpending < 50,
        progress: (data) => Math.max(0, 100 - (data.weekendSpending / 50) * 100)
      },
      {
        id: 'digital_detox',
        title: 'Digital Detox',
        description: 'No online shopping for 2 weeks',
        duration: 14,
        reward: 60,
        icon: '📱',
        condition: (data) => data.noOnlineShopping >= 14,
        progress: (data) => Math.min(100, (data.noOnlineShopping / 14) * 100)
      }
    ];
  }

  // Check and award achievements
  checkAchievements(userData) {
    const newAchievements = [];
    const userAchievements = userData.achievements || [];
    
    this.achievements.forEach(achievement => {
      if (!userAchievements.includes(achievement.id) && achievement.condition(userData)) {
        newAchievements.push(achievement);
      }
    });

    return newAchievements;
  }

  // Get user progress for challenges
  getChallengeProgress(userData) {
    return this.challenges.map(challenge => ({
      ...challenge,
      progress: challenge.progress(userData),
      completed: challenge.condition(userData),
      active: this.isChallengeActive(challenge.id, userData)
    }));
  }

  // Check if challenge is active
  isChallengeActive(challengeId, userData) {
    const activeChallenges = userData.activeChallenges || [];
    return activeChallenges.some(challenge => 
      challenge.id === challengeId && 
      !challenge.completed &&
      this.isWithinDuration(challenge.startDate, challenge.duration)
    );
  }

  // Start a new challenge
  startChallenge(challengeId, userData) {
    const challenge = this.challenges.find(c => c.id === challengeId);
    if (!challenge) return null;

    const activeChallenges = userData.activeChallenges || [];
    const isAlreadyActive = activeChallenges.some(c => c.id === challengeId);
    
    if (isAlreadyActive) return null;

    const newChallenge = {
      id: challengeId,
      startDate: new Date().toISOString(),
      completed: false,
      progress: 0
    };

    return newChallenge;
  }

  // Calculate user level and experience
  calculateLevel(userData) {
    const totalPoints = userData.totalPoints || 0;
    const level = Math.floor(totalPoints / 100) + 1;
    const pointsInCurrentLevel = totalPoints % 100;
    const pointsToNextLevel = 100 - pointsInCurrentLevel;

    return {
      level,
      totalPoints,
      pointsInCurrentLevel,
      pointsToNextLevel,
      progress: (pointsInCurrentLevel / 100) * 100
    };
  }

  // Generate daily streak data
  calculateStreak(userData) {
    const today = new Date();
    const lastActivity = userData.lastActivity ? new Date(userData.lastActivity) : null;
    
    if (!lastActivity) return 0;

    const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 0) {
      return userData.currentStreak || 0;
    } else if (daysDiff === 1) {
      return (userData.currentStreak || 0) + 1;
    } else {
      return 0;
    }
  }

  // Get personalized recommendations based on gamification data
  getPersonalizedRecommendations(userData) {
    const recommendations = [];
    const level = this.calculateLevel(userData);
    const streak = this.calculateStreak(userData);

    // Streak-based recommendations
    if (streak >= 7) {
      recommendations.push({
        type: 'motivation',
        title: 'Streak Champion!',
        message: `You've been tracking for ${streak} days! Keep up the great work.`,
        action: 'Share your achievement with friends'
      });
    } else if (streak === 0) {
      recommendations.push({
        type: 'reminder',
        title: 'Start Your Streak',
        message: 'Log today\'s expenses to start building your tracking streak!',
        action: 'Add an expense now'
      });
    }

    // Level-based recommendations
    if (level.level < 5) {
      recommendations.push({
        type: 'achievement',
        title: 'Level Up!',
        message: `You're level ${level.level}. Complete more achievements to reach level ${level.level + 1}.`,
        action: 'View available achievements'
      });
    }

    // Challenge recommendations
    const activeChallenges = this.getChallengeProgress(userData).filter(c => c.active);
    if (activeChallenges.length === 0) {
      recommendations.push({
        type: 'challenge',
        title: 'Take a Challenge',
        message: 'Try a new financial challenge to earn points and improve your habits.',
        action: 'Browse challenges'
      });
    }

    return recommendations;
  }

  // Helper method to check if challenge is within duration
  isWithinDuration(startDate, duration) {
    const start = new Date(startDate);
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
    const now = new Date();
    return now >= start && now <= end;
  }

  // Get leaderboard data (mock data for now)
  getLeaderboard() {
    return [
      { rank: 1, name: 'Sarah M.', level: 15, points: 1450, streak: 45 },
      { rank: 2, name: 'Mike R.', level: 12, points: 1180, streak: 32 },
      { rank: 3, name: 'Emma L.', level: 10, points: 980, streak: 28 },
      { rank: 4, name: 'David K.', level: 8, points: 820, streak: 15 },
      { rank: 5, name: 'Lisa P.', level: 7, points: 720, streak: 22 }
    ];
  }

  // Calculate daily goals based on user behavior
  calculateDailyGoals(userData) {
    const avgDailyExpenses = userData.avgDailyExpenses || 50;
    const savingsGoal = userData.savingsGoal || 20;

    return {
      maxDailySpending: Math.round(avgDailyExpenses * 0.9), // 10% reduction
      targetSavings: Math.round(avgDailyExpenses * (savingsGoal / 100)),
      streakGoal: (userData.currentStreak || 0) + 1,
      achievementGoal: 1 // Try to earn 1 achievement today
    };
  }
}

export default new GamificationService(); 