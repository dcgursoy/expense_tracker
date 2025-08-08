// Personalization Service for UX features
class PersonalizationService {
  constructor() {
    this.themes = {
      default: {
        name: 'Default',
        colors: {
          primary: '#875cf5',
          secondary: '#cfbefb',
          background: '#fcfbfc',
          surface: '#ffffff',
          text: '#1f2937',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        }
      },
      dark: {
        name: 'Dark Mode',
        colors: {
          primary: '#a78bfa',
          secondary: '#7c3aed',
          background: '#111827',
          surface: '#1f2937',
          text: '#f9fafb',
          textSecondary: '#d1d5db',
          border: '#374151',
          success: '#34d399',
          warning: '#fbbf24',
          error: '#f87171'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        }
      },
      ocean: {
        name: 'Ocean Blue',
        colors: {
          primary: '#0ea5e9',
          secondary: '#0284c7',
          background: '#f0f9ff',
          surface: '#ffffff',
          text: '#0c4a6e',
          textSecondary: '#0369a1',
          border: '#bae6fd',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        }
      },
      sunset: {
        name: 'Sunset Orange',
        colors: {
          primary: '#f97316',
          secondary: '#ea580c',
          background: '#fff7ed',
          surface: '#ffffff',
          text: '#7c2d12',
          textSecondary: '#c2410c',
          border: '#fed7aa',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        }
      },
      forest: {
        name: 'Forest Green',
        colors: {
          primary: '#16a34a',
          secondary: '#15803d',
          background: '#f0fdf4',
          surface: '#ffffff',
          text: '#14532d',
          textSecondary: '#166534',
          border: '#bbf7d0',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        }
      }
    };

    this.seasonalThemes = {
      winter: {
        name: 'Winter Wonderland',
        colors: {
          primary: '#3b82f6',
          secondary: '#1e40af',
          background: '#f8fafc',
          surface: '#ffffff',
          text: '#1e293b',
          textSecondary: '#475569',
          border: '#cbd5e1',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        },
        backgroundImage: 'snowflakes'
      },
      spring: {
        name: 'Spring Blossom',
        colors: {
          primary: '#ec4899',
          secondary: '#be185d',
          background: '#fdf2f8',
          surface: '#ffffff',
          text: '#831843',
          textSecondary: '#be185d',
          border: '#fbcfe8',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        },
        backgroundImage: 'cherry-blossoms'
      },
      summer: {
        name: 'Summer Sunshine',
        colors: {
          primary: '#f59e0b',
          secondary: '#d97706',
          background: '#fffbeb',
          surface: '#ffffff',
          text: '#92400e',
          textSecondary: '#b45309',
          border: '#fde68a',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        },
        backgroundImage: 'sunshine'
      },
      autumn: {
        name: 'Autumn Leaves',
        colors: {
          primary: '#dc2626',
          secondary: '#b91c1c',
          background: '#fef2f2',
          surface: '#ffffff',
          text: '#7f1d1d',
          textSecondary: '#991b1b',
          border: '#fecaca',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444'
        },
        fonts: {
          primary: 'Poppins',
          secondary: 'Inter'
        },
        backgroundImage: 'falling-leaves'
      }
    };
  }

  // Get current theme
  getCurrentTheme() {
    const savedTheme = localStorage.getItem('expense-tracker-theme') || 'default';
    return this.themes[savedTheme] || this.themes.default;
  }

  // Get seasonal theme based on current date
  getSeasonalTheme() {
    const month = new Date().getMonth();
    let season;
    
    if (month >= 2 && month <= 4) season = 'spring';
    else if (month >= 5 && month <= 7) season = 'summer';
    else if (month >= 8 && month <= 10) season = 'autumn';
    else season = 'winter';
    
    return this.seasonalThemes[season];
  }

  // Set theme
  setTheme(themeName) {
    if (this.themes[themeName]) {
      localStorage.setItem('expense-tracker-theme', themeName);
      this.applyTheme(this.themes[themeName]);
      return true;
    }
    return false;
  }

  // Apply theme to DOM
  applyTheme(theme) {
    const root = document.documentElement;
    
    // Apply colors
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Apply fonts
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    // Apply background image if exists
    if (theme.backgroundImage) {
      root.style.setProperty('--background-image', `url('/images/${theme.backgroundImage}.png')`);
    } else {
      root.style.removeProperty('--background-image');
    }
  }

  // Get user preferences
  getUserPreferences() {
    const preferences = {
      theme: localStorage.getItem('expense-tracker-theme') || 'default',
      autoSeasonal: localStorage.getItem('expense-tracker-auto-seasonal') === 'true',
      notifications: localStorage.getItem('expense-tracker-notifications') !== 'false',
      hapticFeedback: localStorage.getItem('expense-tracker-haptic') === 'true',
      compactMode: localStorage.getItem('expense-tracker-compact') === 'true',
      currency: localStorage.getItem('expense-tracker-currency') || 'USD',
      language: localStorage.getItem('expense-tracker-language') || 'en',
      dashboardLayout: localStorage.getItem('expense-tracker-layout') || 'default'
    };

    return preferences;
  }

  // Save user preferences
  saveUserPreferences(preferences) {
    Object.entries(preferences).forEach(([key, value]) => {
      localStorage.setItem(`expense-tracker-${key}`, value);
    });
  }

  // Get personalized dashboard layout
  getDashboardLayout(userData) {
    const layout = localStorage.getItem('expense-tracker-layout') || 'default';
    const preferences = this.getUserPreferences();
    
    const layouts = {
      default: {
        name: 'Default',
        grid: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        components: [
          { id: 'financial-overview', size: 'col-span-full' },
          { id: 'recent-transactions', size: 'col-span-1' },
          { id: 'expense-chart', size: 'col-span-1' },
          { id: 'income-chart', size: 'col-span-1' },
          { id: 'budget-progress', size: 'col-span-1' },
          { id: 'achievements', size: 'col-span-1' }
        ]
      },
      compact: {
        name: 'Compact',
        grid: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4',
        components: [
          { id: 'financial-overview', size: 'col-span-full' },
          { id: 'recent-transactions', size: 'col-span-2' },
          { id: 'expense-chart', size: 'col-span-2' },
          { id: 'income-chart', size: 'col-span-2' },
          { id: 'budget-progress', size: 'col-span-1' },
          { id: 'achievements', size: 'col-span-1' },
          { id: 'quick-actions', size: 'col-span-1' }
        ]
      },
      focused: {
        name: 'Focused',
        grid: 'grid-cols-1 lg:grid-cols-2',
        components: [
          { id: 'financial-overview', size: 'col-span-full' },
          { id: 'expense-chart', size: 'col-span-1' },
          { id: 'income-chart', size: 'col-span-1' },
          { id: 'recent-transactions', size: 'col-span-full' },
          { id: 'budget-progress', size: 'col-span-1' },
          { id: 'achievements', size: 'col-span-1' }
        ]
      }
    };

    return layouts[layout] || layouts.default;
  }

  // Get personalized color scheme based on user behavior
  getPersonalizedColors(userData) {
    const personality = userData.personality || 'balanced';
    const financialHealth = userData.financialHealthScore || 50;
    
    let colorScheme = 'default';
    
    // Personality-based colors
    if (personality === 'saver') {
      colorScheme = 'forest'; // Green for savers
    } else if (personality === 'spender') {
      colorScheme = 'sunset'; // Orange for spenders
    } else if (personality === 'planner') {
      colorScheme = 'ocean'; // Blue for planners
    }
    
    // Financial health adjustments
    if (financialHealth < 30) {
      colorScheme = 'sunset'; // Warning colors for poor financial health
    } else if (financialHealth > 80) {
      colorScheme = 'forest'; // Success colors for excellent financial health
    }
    
    return this.themes[colorScheme] || this.themes.default;
  }

  // Get mood-based recommendations
  getMoodBasedRecommendations(userData, currentMood) {
    const recommendations = [];
    
    if (currentMood === 'stressed') {
      recommendations.push({
        type: 'mood',
        title: 'Take a Financial Break',
        message: 'When stressed, we tend to make impulsive financial decisions. Consider waiting 24 hours before any major purchase.',
        action: 'Set a spending pause reminder',
        color: 'warning'
      });
    } else if (currentMood === 'happy') {
      recommendations.push({
        type: 'mood',
        title: 'Celebrate Responsibly',
        message: 'Great mood! Remember to stick to your budget even when celebrating.',
        action: 'Set a celebration budget',
        color: 'success'
      });
    } else if (currentMood === 'tired') {
      recommendations.push({
        type: 'mood',
        title: 'Avoid Late-Night Spending',
        message: 'Late-night shopping can lead to impulse purchases. Consider reviewing your expenses tomorrow.',
        action: 'Schedule expense review',
        color: 'info'
      });
    }
    
    return recommendations;
  }

  // Get accessibility preferences
  getAccessibilityPreferences() {
    return {
      highContrast: localStorage.getItem('expense-tracker-high-contrast') === 'true',
      largeText: localStorage.getItem('expense-tracker-large-text') === 'true',
      reducedMotion: localStorage.getItem('expense-tracker-reduced-motion') === 'true',
      screenReader: localStorage.getItem('expense-tracker-screen-reader') === 'true'
    };
  }

  // Apply accessibility settings
  applyAccessibilitySettings(settings) {
    const root = document.documentElement;
    
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
    
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }

  // Get available themes
  getAvailableThemes() {
    return {
      standard: this.themes,
      seasonal: this.seasonalThemes
    };
  }

  // Initialize personalization
  initialize() {
    const preferences = this.getUserPreferences();
    const accessibility = this.getAccessibilityPreferences();
    
    // Apply theme
    if (preferences.autoSeasonal) {
      const seasonalTheme = this.getSeasonalTheme();
      this.applyTheme(seasonalTheme);
    } else {
      const theme = this.getCurrentTheme();
      this.applyTheme(theme);
    }
    
    // Apply accessibility settings
    this.applyAccessibilitySettings(accessibility);
    
    // Apply haptic feedback if enabled
    if (preferences.hapticFeedback && 'vibrate' in navigator) {
      this.enableHapticFeedback();
    }
  }

  // Enable haptic feedback
  enableHapticFeedback() {
    // Add event listeners for haptic feedback
    document.addEventListener('click', (e) => {
      if (e.target.matches('button, .clickable')) {
        navigator.vibrate(10);
      }
    });
  }

  // Get personalized welcome message
  getWelcomeMessage(userData) {
    const hour = new Date().getHours();
    const name = userData.name || 'there';
    const personality = userData.personality || 'balanced';
    
    let greeting = '';
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 17) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    const messages = {
      saver: `${greeting}, ${name}! Your disciplined approach to finances is inspiring.`,
      spender: `${greeting}, ${name}! Let's work together to build better spending habits.`,
      planner: `${greeting}, ${name}! Your organized approach to finances is paying off.`,
      balanced: `${greeting}, ${name}! Ready to track your finances today?`
    };
    
    return messages[personality] || messages.balanced;
  }
}

export default new PersonalizationService(); 