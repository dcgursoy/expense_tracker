// Analytics Service for advanced insights
class AnalyticsService {
  // Calculate Financial Health Score (0-100)
  calculateFinancialHealthScore(expenses, income, savings, budget) {
    let score = 0;
    
    // Calculate total expenses from the array
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Savings Rate (30 points)
    const savingsRate = ((income - totalExpenses) / income) * 100;
    if (savingsRate >= 20) score += 30;
    else if (savingsRate >= 10) score += 20;
    else if (savingsRate >= 5) score += 10;
    
    // Budget Adherence (25 points)
    const budgetAdherence = totalExpenses <= budget ? 25 : Math.max(0, 25 - ((totalExpenses - budget) / budget) * 25);
    score += budgetAdherence;
    
    // Expense Diversity (20 points)
    const categories = new Set(expenses.map(exp => exp.category)).size;
    const diversityScore = Math.min(20, categories * 2);
    score += diversityScore;
    
    // Emergency Fund (15 points)
    const emergencyFundRatio = savings / (totalExpenses * 3); // 3 months of expenses
    if (emergencyFundRatio >= 1) score += 15;
    else if (emergencyFundRatio >= 0.5) score += 10;
    else if (emergencyFundRatio >= 0.25) score += 5;
    
    // Spending Consistency (10 points)
    const monthlyExpenses = this.getMonthlyExpenses(expenses);
    const allMonthlyValues = Object.values(monthlyExpenses).flat();
    const variance = this.calculateVariance(allMonthlyValues);
    const consistencyScore = Math.max(0, 10 - variance * 10);
    score += consistencyScore;
    
    return Math.round(score);
  }

  // Analyze spending personality
  analyzeSpendingPersonality(expenses, income) {
    const personality = {
      type: '',
      traits: [],
      recommendations: []
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((income - totalExpenses) / income) * 100;
    const categories = this.groupByCategory(expenses);
    const impulseSpending = this.calculateImpulseSpending(expenses);
    const planningScore = this.calculatePlanningScore(expenses);

    // Determine personality type
    if (savingsRate >= 25 && planningScore >= 7) {
      personality.type = 'Saver';
      personality.traits = ['Disciplined', 'Future-oriented', 'Risk-averse'];
      personality.recommendations = [
        'Consider investing your savings for better returns',
        'You might be too conservative - allow yourself some fun spending',
        'Great job! Keep up the excellent financial habits'
      ];
    } else if (savingsRate >= 10 && impulseSpending < 0.3) {
      personality.type = 'Planner';
      personality.traits = ['Organized', 'Balanced', 'Goal-oriented'];
      personality.recommendations = [
        'Set specific financial goals to stay motivated',
        'Consider automating your savings',
        'Track your progress regularly'
      ];
    } else if (impulseSpending > 0.5) {
      personality.type = 'Spender';
      personality.traits = ['Impulsive', 'Present-focused', 'Social'];
      personality.recommendations = [
        'Use the 24-hour rule before making purchases',
        'Set up automatic savings transfers',
        'Track your spending daily to build awareness'
      ];
    } else {
      personality.type = 'Balancer';
      personality.traits = ['Flexible', 'Adaptive', 'Moderate'];
      personality.recommendations = [
        'Focus on building an emergency fund',
        'Set up automatic bill payments',
        'Review your spending patterns monthly'
      ];
    }

    return personality;
  }

  // Calculate spending trends
  calculateTrends(expenses, months = 6) {
    const trends = {};
    const monthlyData = this.getMonthlyExpenses(expenses, months);
    
    Object.keys(monthlyData).forEach(category => {
      const values = monthlyData[category];
      if (values.length >= 2) {
        const trend = this.calculateLinearTrend(values);
        trends[category] = {
          direction: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
          rate: Math.abs(trend),
          confidence: this.calculateTrendConfidence(values)
        };
      }
    });

    return trends;
  }

  // Generate personalized recommendations
  generateRecommendations(expenses, income, goals) {
    const recommendations = [];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((income - totalExpenses) / income) * 100;
    const categories = this.groupByCategory(expenses);
    const topSpendingCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0];

    // Savings recommendations
    if (savingsRate < 20) {
      recommendations.push({
        type: 'savings',
        priority: 'high',
        title: 'Increase Savings Rate',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for 20% or higher.`,
        action: 'Set up automatic transfers to savings account',
        potentialSavings: income * 0.2 - (income - totalExpenses)
      });
    }

    // Category-specific recommendations
    if (topSpendingCategory && topSpendingCategory[1] > totalExpenses * 0.4) {
      recommendations.push({
        type: 'category',
        priority: 'medium',
        title: 'Diversify Spending',
        description: `${topSpendingCategory[0]} accounts for ${((topSpendingCategory[1] / totalExpenses) * 100).toFixed(1)}% of expenses.`,
        action: 'Look for ways to reduce spending in this category',
        potentialSavings: topSpendingCategory[1] * 0.1
      });
    }

    // Budget recommendations
    const monthlyExpenses = this.getMonthlyExpenses(expenses);
    // Calculate variance across all categories
    const allMonthlyValues = Object.values(monthlyExpenses).flat();
    const variance = this.calculateVariance(allMonthlyValues);
    if (variance > 0.3) {
      recommendations.push({
        type: 'budget',
        priority: 'medium',
        title: 'Stabilize Spending',
        description: 'Your spending varies significantly month-to-month.',
        action: 'Create a monthly budget and track adherence',
        potentialSavings: 'Variable'
      });
    }

    return recommendations;
  }

  // Helper methods
  groupByCategory(expenses) {
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });
    return categories;
  }

  getMonthlyExpenses(expenses, months = 6) {
    const monthlyData = {};
    const now = new Date();
    
    for (let i = 0; i < months; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate >= monthStart && expDate <= monthEnd;
      });

      const categories = this.groupByCategory(monthExpenses);
      Object.keys(categories).forEach(category => {
        if (!monthlyData[category]) {
          monthlyData[category] = [];
        }
        monthlyData[category].push(categories[category]);
      });
    }

    return monthlyData;
  }

  calculateVariance(values) {
    // Ensure values is an array and has at least 2 elements
    if (!Array.isArray(values) || values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    if (mean === 0) return 0; // Avoid division by zero
    
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
    return Math.sqrt(variance) / mean; // Coefficient of variation
  }

  calculateLinearTrend(values) {
    // Ensure values is an array and has at least 2 elements
    if (!Array.isArray(values) || values.length < 2) return 0;
    
    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((sum, val) => sum + val, 0);
    const sumXY = values.reduce((sum, val, i) => sum + val * i, 0);
    const sumX2 = values.reduce((sum, val, i) => sum + i * i, 0);
    
    const denominator = (n * sumX2 - sumX * sumX);
    if (denominator === 0) return 0; // Avoid division by zero
    
    const slope = (n * sumXY - sumX * sumY) / denominator;
    return slope;
  }

  calculateTrendConfidence(values) {
    // Ensure values is an array and has at least 3 elements
    if (!Array.isArray(values) || values.length < 3) return 0.5;
    
    const variance = this.calculateVariance(values);
    return Math.max(0.1, 1 - variance);
  }

  calculateImpulseSpending(expenses) {
    // Assume expenses on weekends or late hours are more likely to be impulse
    const impulseExpenses = expenses.filter(exp => {
      const date = new Date(exp.date);
      const dayOfWeek = date.getDay();
      const hour = date.getHours();
      return dayOfWeek === 0 || dayOfWeek === 6 || hour >= 22 || hour <= 6;
    });

    const totalImpulse = impulseExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    return totalExpenses > 0 ? totalImpulse / totalExpenses : 0;
  }

  calculatePlanningScore(expenses) {
    // Higher score for expenses that are regular and predictable
    const regularExpenses = expenses.filter(exp => {
      const amount = exp.amount;
      const category = exp.category;
      return ['rent', 'mortgage', 'utilities', 'insurance'].includes(category) || 
             (amount > 100 && amount % 50 === 0); // Likely planned purchases
    });

    return Math.min(10, (regularExpenses.length / expenses.length) * 10);
  }
}

export default new AnalyticsService(); 