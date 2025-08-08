// Predictive Service for proactive features
class PredictiveService {
  constructor() {
    this.subscriptionPatterns = [
      { name: 'Netflix', keywords: ['netflix'], amount: 15.99, frequency: 'monthly' },
      { name: 'Spotify', keywords: ['spotify'], amount: 9.99, frequency: 'monthly' },
      { name: 'Amazon Prime', keywords: ['amazon prime', 'prime'], amount: 12.99, frequency: 'monthly' },
      { name: 'Gym Membership', keywords: ['gym', 'fitness', 'planet fitness'], amount: 25, frequency: 'monthly' },
      { name: 'Phone Bill', keywords: ['verizon', 'att', 'tmobile', 'sprint'], amount: 80, frequency: 'monthly' },
      { name: 'Internet', keywords: ['comcast', 'xfinity', 'spectrum'], amount: 60, frequency: 'monthly' }
    ];

    this.billPatterns = [
      { name: 'Rent/Mortgage', keywords: ['rent', 'mortgage'], amount: null, frequency: 'monthly', dayOfMonth: 1 },
      { name: 'Electricity', keywords: ['electric', 'power'], amount: null, frequency: 'monthly', dayOfMonth: 15 },
      { name: 'Water', keywords: ['water', 'utility'], amount: null, frequency: 'monthly', dayOfMonth: 20 },
      { name: 'Insurance', keywords: ['insurance', 'geico', 'state farm'], amount: null, frequency: 'monthly', dayOfMonth: 25 }
    ];
  }

  // Detect recurring subscriptions from expenses
  detectSubscriptions(expenses) {
    const subscriptions = [];
    const processed = new Set();

    expenses.forEach(expense => {
      const description = (expense.description || expense.category || '').toLowerCase();
      const amount = expense.amount;
      const date = new Date(expense.date);

      // Check against known patterns
      this.subscriptionPatterns.forEach(pattern => {
        if (pattern.keywords.some(keyword => description.includes(keyword)) && 
            Math.abs(amount - pattern.amount) < 5 && // Allow $5 variance
            !processed.has(pattern.name)) {
          
          const lastOccurrence = this.findLastOccurrence(expenses, pattern.keywords, date);
          const nextDue = this.calculateNextDue(lastOccurrence, pattern.frequency);
          
          subscriptions.push({
            name: pattern.name,
            amount: amount,
            frequency: pattern.frequency,
            lastPaid: lastOccurrence,
            nextDue: nextDue,
            status: this.getSubscriptionStatus(nextDue),
            confidence: 0.9
          });

          processed.add(pattern.name);
        }
      });
    });

    // Detect unknown recurring patterns
    const unknownPatterns = this.detectUnknownPatterns(expenses);
    subscriptions.push(...unknownPatterns);

    return subscriptions;
  }

  // Detect unknown recurring patterns
  detectUnknownPatterns(expenses) {
    const patterns = [];
    const groupedByDescription = {};

    // Group expenses by similar descriptions
    expenses.forEach(expense => {
      const key = this.normalizeDescription(expense.description || expense.category || 'unknown');
      if (!groupedByDescription[key]) {
        groupedByDescription[key] = [];
      }
      groupedByDescription[key].push(expense);
    });

    // Find recurring patterns
    Object.entries(groupedByDescription).forEach(([description, expenses]) => {
      if (expenses.length >= 3) { // At least 3 occurrences
        const amounts = expenses.map(exp => exp.amount);
        const dates = expenses.map(exp => new Date(exp.date)).sort((a, b) => a - b);
        
        // Check if amounts are similar (within 10% variance)
        const avgAmount = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
        const variance = amounts.every(amt => Math.abs(amt - avgAmount) / avgAmount < 0.1);
        
        if (variance) {
          const frequency = this.detectFrequency(dates);
          if (frequency) {
            const lastOccurrence = dates[dates.length - 1];
            const nextDue = this.calculateNextDue(lastOccurrence, frequency);
            
            patterns.push({
              name: expenses[0].description || expenses[0].category || 'Unknown Recurring Expense',
              amount: avgAmount,
              frequency: frequency,
              lastPaid: lastOccurrence,
              nextDue: nextDue,
              status: this.getSubscriptionStatus(nextDue),
              confidence: 0.7,
              isDetected: true
            });
          }
        }
      }
    });

    return patterns;
  }

  // Predict upcoming bills
  predictUpcomingBills(expenses, daysAhead = 30) {
    const upcomingBills = [];
    const subscriptions = this.detectSubscriptions(expenses);
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    // Add detected subscriptions
    subscriptions.forEach(sub => {
      if (sub.nextDue <= futureDate && sub.nextDue >= now) {
        upcomingBills.push({
          name: sub.name,
          amount: sub.amount,
          dueDate: sub.nextDue,
          type: 'subscription',
          confidence: sub.confidence,
          category: this.categorizeBill(sub.name)
        });
      }
    });

    // Add predicted bills based on patterns
    const billPredictions = this.predictBillsFromPatterns(expenses, daysAhead);
    upcomingBills.push(...billPredictions);

    return upcomingBills.sort((a, b) => a.dueDate - b.dueDate);
  }

  // Predict bills from historical patterns
  predictBillsFromPatterns(expenses, daysAhead) {
    const predictions = [];
    const now = new Date();
    const futureDate = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

    // Group expenses by category and find monthly patterns
    const monthlyExpenses = this.groupByMonth(expenses);
    const categories = Object.keys(monthlyExpenses);

    categories.forEach(category => {
      const monthlyAmounts = monthlyExpenses[category];
      if (monthlyAmounts.length >= 2) {
        const avgAmount = monthlyAmounts.reduce((sum, amt) => sum + amt, 0) / monthlyAmounts.length;
        const lastMonth = monthlyAmounts[monthlyAmounts.length - 1];
        
        // Predict next month's bill
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        if (nextMonth <= futureDate) {
          predictions.push({
            name: `${category} Bill`,
            amount: Math.round(avgAmount),
            dueDate: nextMonth,
            type: 'predicted',
            confidence: 0.6,
            category: category,
            basedOn: `${monthlyAmounts.length} months of data`
          });
        }
      }
    });

    return predictions;
  }

  // Generate smart notifications
  generateSmartNotifications(userData, expenses) {
    const notifications = [];
    const now = new Date();
    const upcomingBills = this.predictUpcomingBills(expenses, 7); // Next 7 days

    // Bill reminders
    upcomingBills.forEach(bill => {
      const daysUntilDue = Math.ceil((bill.dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 3) {
        notifications.push({
          type: 'bill_reminder',
          priority: 'high',
          title: 'Bill Due Soon',
          message: `${bill.name} ($${bill.amount}) is due in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}`,
          action: 'Mark as paid',
          data: { billId: bill.name, amount: bill.amount }
        });
      }
    });

    // Spending alerts
    const todayExpenses = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.toDateString() === now.toDateString();
    });

    const totalToday = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const avgDaily = this.calculateAverageDailySpending(expenses);

    if (totalToday > avgDaily * 1.5) {
      notifications.push({
        type: 'spending_alert',
        priority: 'medium',
        title: 'High Spending Today',
        message: `You've spent $${totalToday.toFixed(2)} today, which is ${Math.round((totalToday / avgDaily) * 100)}% of your average daily spending.`,
        action: 'Review today\'s expenses',
        data: { amount: totalToday, average: avgDaily }
      });
    }

    // Budget warnings
    const monthlyExpenses = this.getMonthlyExpenses(expenses);
    const monthlyBudget = userData.monthlyBudget || 2000;
    const currentMonthTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const budgetPercentage = (currentMonthTotal / monthlyBudget) * 100;

    if (budgetPercentage > 80) {
      notifications.push({
        type: 'budget_warning',
        priority: 'high',
        title: 'Budget Warning',
        message: `You've used ${budgetPercentage.toFixed(1)}% of your monthly budget.`,
        action: 'Review budget',
        data: { used: currentMonthTotal, budget: monthlyBudget, percentage: budgetPercentage }
      });
    }

    // Savings encouragement
    const savingsRate = this.calculateSavingsRate(expenses, userData.monthlyIncome);
    if (savingsRate < 15) {
      notifications.push({
        type: 'savings_reminder',
        priority: 'low',
        title: 'Savings Opportunity',
        message: `Your current savings rate is ${savingsRate.toFixed(1)}%. Consider increasing it to 20% for better financial health.`,
        action: 'Set savings goal',
        data: { currentRate: savingsRate, targetRate: 20 }
      });
    }

    return notifications;
  }

  // Helper methods
  findLastOccurrence(expenses, keywords, beforeDate) {
    const matchingExpenses = expenses.filter(exp => 
      keywords.some(keyword => (exp.description || exp.category || '').toLowerCase().includes(keyword)) &&
      new Date(exp.date) <= beforeDate
    );

    if (matchingExpenses.length === 0) return null;
    
    return new Date(Math.max(...matchingExpenses.map(exp => new Date(exp.date))));
  }

  calculateNextDue(lastOccurrence, frequency) {
    if (!lastOccurrence) return null;

    const next = new Date(lastOccurrence);
    switch (frequency) {
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'yearly':
        next.setFullYear(next.getFullYear() + 1);
        break;
      default:
        return null;
    }

    return next;
  }

  getSubscriptionStatus(nextDue) {
    if (!nextDue) return 'unknown';
    
    const now = new Date();
    const daysUntilDue = Math.ceil((nextDue - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) return 'overdue';
    if (daysUntilDue <= 3) return 'due_soon';
    if (daysUntilDue <= 7) return 'upcoming';
    return 'active';
  }

  normalizeDescription(description) {
    if (!description) return '';
    return description.toLowerCase()
      .replace(/[0-9]/g, '')
      .replace(/[^a-z\s]/g, '')
      .trim();
  }

  detectFrequency(dates) {
    if (dates.length < 2) return null;

    const intervals = [];
    for (let i = 1; i < dates.length; i++) {
      const interval = Math.abs(dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
      intervals.push(interval);
    }

    const avgInterval = intervals.reduce((sum, int) => sum + int, 0) / intervals.length;
    
    if (avgInterval >= 25 && avgInterval <= 35) return 'monthly';
    if (avgInterval >= 6 && avgInterval <= 8) return 'weekly';
    if (avgInterval >= 350 && avgInterval <= 380) return 'yearly';
    
    return null;
  }

  categorizeBill(billName) {
    const name = billName.toLowerCase();
    if (name.includes('rent') || name.includes('mortgage')) return 'housing';
    if (name.includes('electric') || name.includes('water') || name.includes('gas')) return 'utilities';
    if (name.includes('insurance')) return 'insurance';
    if (name.includes('phone') || name.includes('internet')) return 'utilities';
    if (name.includes('netflix') || name.includes('spotify') || name.includes('amazon')) return 'entertainment';
    return 'other';
  }

  groupByMonth(expenses) {
    const monthly = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!monthly[monthKey]) {
        monthly[monthKey] = [];
      }
      monthly[monthKey].push(expense.amount);
    });

    // Convert to category-based monthly totals
    const categoryMonthly = {};
    Object.entries(monthly).forEach(([month, amounts]) => {
      const total = amounts.reduce((sum, amt) => sum + amt, 0);
      categoryMonthly[month] = total;
    });

    return categoryMonthly;
  }

  calculateAverageDailySpending(expenses) {
    if (expenses.length === 0) return 0;
    
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const days = this.getDaysBetween(expenses);
    
    return total / Math.max(days, 1);
  }

  getDaysBetween(expenses) {
    if (expenses.length === 0) return 0;
    
    const dates = expenses.map(exp => new Date(exp.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    
    return Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;
  }

  getMonthlyExpenses(expenses) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    });
  }

  calculateSavingsRate(expenses, income) {
    if (!income) return 0;
    
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    return ((income - totalExpenses) / income) * 100;
  }
}

export default new PredictiveService(); 