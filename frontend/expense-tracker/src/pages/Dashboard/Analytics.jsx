import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import { 
  IoMdTrendingUp, 
  IoMdTrendingDown, 
  IoMdPie, 
  IoMdCalendar,
  IoMdStats,
  IoMdAnalytics
} from 'react-icons/io';
import { addThousandsSeparator } from '../../utils/helper';

const Analytics = () => {
  useUserAuth();
  const [analyticsData, setAnalyticsData] = useState({
    expenses: [],
    income: [],
    monthlyData: [],
    categoryBreakdown: [],
    spendingTrends: [],
    savingsRate: 0,
    budgetUtilization: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    fetchAnalyticsData();
  }, [selectedPeriod]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      // Fetch expenses and income data
      const [expensesRes, incomeRes] = await Promise.all([
        axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
        axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME)
      ]);

      const expenses = expensesRes.data || [];
      const income = incomeRes.data || [];

      // Calculate analytics
      const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
      const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
      const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

      // Category breakdown
      const categoryBreakdown = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      }, {});

      // Monthly trends
      const monthlyData = calculateMonthlyTrends(expenses, income);

      setAnalyticsData({
        expenses,
        income,
        totalIncome,
        totalExpenses,
        savingsRate,
        categoryBreakdown,
        monthlyData
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyTrends = (expenses, income) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.map((month, index) => {
      const monthExpenses = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === index;
      });
      
      const monthIncome = income.filter(inc => {
        const incDate = new Date(inc.date);
        return incDate.getMonth() === index;
      });

      return {
        month,
        expenses: monthExpenses.reduce((sum, exp) => sum + exp.amount, 0),
        income: monthIncome.reduce((sum, inc) => sum + inc.amount, 0),
        isCurrent: index === currentMonth
      };
    });
  };

  const getTopCategories = () => {
    const sorted = Object.entries(analyticsData.categoryBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5);
    
    return sorted.map(([category, amount]) => ({
      category,
      amount,
      percentage: (amount / analyticsData.totalExpenses) * 100
    }));
  };

  const getSavingsStatus = () => {
    if (analyticsData.savingsRate >= 20) return { status: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (analyticsData.savingsRate >= 10) return { status: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (analyticsData.savingsRate >= 5) return { status: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Needs Improvement', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <DashboardLayout activeMenu="Analytics">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeMenu="Analytics">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Analytics 📊
          </h1>
          <p className="text-gray-600">Deep insights into your financial patterns</p>
        </div>

        {/* Period Selector */}
        <div className="flex justify-center mb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-1 shadow-lg">
            {['7', '30', '90', '365'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                {period} Days
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(analyticsData.totalIncome)}
                </p>
              </div>
              <IoMdTrendingUp className="text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(analyticsData.totalExpenses)}
                </p>
              </div>
              <IoMdTrendingDown className="text-3xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Net Savings</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(analyticsData.totalIncome - analyticsData.totalExpenses)}
                </p>
              </div>
              <IoMdPie className="text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Savings Rate</p>
                <p className="text-2xl font-bold mt-1">
                  {analyticsData.savingsRate.toFixed(1)}%
                </p>
              </div>
              <IoMdStats className="text-3xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Savings Status */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Savings Analysis</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Your current savings rate is</p>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  {analyticsData.savingsRate.toFixed(1)}%
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSavingsStatus().bg} ${getSavingsStatus().color}`}>
                  {getSavingsStatus().status}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 mb-1">Recommended</p>
              <p className="text-2xl font-bold text-green-600">20%</p>
            </div>
          </div>
        </div>

        {/* Top Spending Categories */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Spending Categories</h3>
          <div className="space-y-4">
            {getTopCategories().map((item, index) => (
              <div key={item.category} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.category}</p>
                    <p className="text-sm text-gray-500">{item.percentage.toFixed(1)}% of total</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">${addThousandsSeparator(item.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Monthly Trends</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {analyticsData.monthlyData.slice(-6).map((month, index) => (
              <div key={month.month} className={`p-4 rounded-xl border-2 ${
                month.isCurrent 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <p className="text-sm font-medium text-gray-600 mb-2">{month.month}</p>
                <div className="space-y-1">
                  <p className="text-xs text-green-600">+${addThousandsSeparator(month.income)}</p>
                  <p className="text-xs text-red-600">-${addThousandsSeparator(month.expenses)}</p>
                </div>
                {month.isCurrent && (
                  <div className="mt-2">
                    <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      Current
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics; 