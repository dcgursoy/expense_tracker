// AI Service for smart features
class AIService {
  // Smart expense categorization based on description
  categorizeExpense(description, amount) {
    const keywords = {
      'food': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'pizza', 'burger', 'subway', 'starbucks', 'mcdonalds'],
      'transportation': ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'metro', 'bus', 'train', 'airline', 'flight'],
      'shopping': ['amazon', 'walmart', 'target', 'mall', 'clothing', 'shoes', 'electronics', 'online'],
      'entertainment': ['netflix', 'spotify', 'movie', 'theater', 'concert', 'game', 'hobby', 'gym', 'fitness'],
      'utilities': ['electricity', 'water', 'gas', 'internet', 'phone', 'cable', 'wifi'],
      'healthcare': ['pharmacy', 'doctor', 'hospital', 'medical', 'dental', 'vision', 'insurance'],
      'education': ['books', 'course', 'tuition', 'school', 'university', 'training'],
      'housing': ['rent', 'mortgage', 'home', 'apartment', 'maintenance', 'repair']
    };

    const lowerDesc = description.toLowerCase();
    
    for (const [category, words] of Object.entries(keywords)) {
      if (words.some(word => lowerDesc.includes(word))) {
        return category;
      }
    }

    // Fallback based on amount patterns
    if (amount < 10) return 'food';
    if (amount < 50) return 'shopping';
    if (amount < 200) return 'entertainment';
    return 'other';
  }

  // Predict future expenses based on historical data
  predictExpenses(historicalData, months = 3) {
    const predictions = [];
    const categories = {};
    
    // Group by category and calculate averages
    historicalData.forEach(expense => {
      const category = expense.category;
      if (!categories[category]) {
        categories[category] = { total: 0, count: 0, monthly: 0 };
      }
      categories[category].total += expense.amount;
      categories[category].count += 1;
    });

    // Calculate monthly averages
    Object.keys(categories).forEach(category => {
      categories[category].monthly = categories[category].total / months;
    });

    // Generate predictions for next 3 months
    for (let i = 1; i <= 3; i++) {
      const monthPredictions = Object.entries(categories).map(([category, data]) => ({
        category,
        predictedAmount: Math.round(data.monthly * (1 + (Math.random() * 0.2 - 0.1))), // Add some variance
        confidence: Math.min(0.9, data.count / 10), // More data = higher confidence
        month: i
      }));
      predictions.push(...monthPredictions);
    }

    return predictions;
  }

  // Detect spending anomalies
  detectAnomalies(expenses, threshold = 2) {
    const anomalies = [];
    const categories = {};
    
    // Calculate average spending per category
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = [];
      }
      categories[expense.category].push(expense.amount);
    });

    // Detect anomalies (spending > 2x average)
    Object.entries(categories).forEach(([category, amounts]) => {
      const avg = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
      const recentExpenses = amounts.slice(-5); // Last 5 expenses
      
      recentExpenses.forEach((amount, index) => {
        if (amount > avg * threshold) {
          anomalies.push({
            category,
            amount,
            average: Math.round(avg),
            severity: amount / avg,
            date: new Date(Date.now() - (4 - index) * 24 * 60 * 60 * 1000)
          });
        }
      });
    });

    return anomalies;
  }

  // Generate spending insights
  generateInsights(expenses, income) {
    const insights = [];
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const savingsRate = ((income - totalExpenses) / income) * 100;
    
    // Spending pattern insights
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = 0;
      }
      categories[expense.category] += expense.amount;
    });

    const topCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b - a)[0];

    if (savingsRate < 20) {
      insights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `Your savings rate is ${savingsRate.toFixed(1)}%. Consider increasing it to 20% for better financial health.`,
        action: 'Review your spending in high-cost categories'
      });
    }

    if (topCategory && topCategory[1] > totalExpenses * 0.4) {
      insights.push({
        type: 'info',
        title: 'High Category Concentration',
        message: `${topCategory[0]} accounts for ${((topCategory[1] / totalExpenses) * 100).toFixed(1)}% of your expenses.`,
        action: 'Consider diversifying your spending'
      });
    }

    return insights;
  }
}

export default new AIService(); 