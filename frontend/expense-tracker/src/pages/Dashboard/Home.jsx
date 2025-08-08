import React, { useState, useEffect, useContext } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout'
import { useUserAuth } from '../../hooks/useUserAuth'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import InfoCard from '../../components/Cards/InfoCard'
import { UserContext } from '../../context/userContext'

import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from 'react-icons/io';
import { addThousandsSeparator } from '../../utils/helper'

import FinanceOverview from '../../components/Dashboard/FinanceOverview'

import RecentTransactions from '../../components/Dashboard/RecentTransactions'

import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions'

import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses'
import SmartDashboard from '../../components/Dashboard/SmartDashboard'

import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart'

import RecentIncome from '../../components/Dashboard/RecentIncome'

const Home = () => {
  useUserAuth();
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try{
      const response = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if(response.data){
        setDashboardData(response.data);
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.", error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);
  
  
  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.fullName?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-gray-600">Here's your financial overview for today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Balance</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(dashboardData?.totalBalance || 0)}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <IoMdCard className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Income</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(dashboardData?.totalIncome || 0)}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <LuWalletMinimal className="text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Total Expenses</p>
                <p className="text-2xl font-bold mt-1">
                  ${addThousandsSeparator(dashboardData?.totalExpenses || 0)}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <LuHandCoins className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Smart Dashboard with AI Features */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
          <SmartDashboard 
            expenses={dashboardData?.last30DaysExpenses?.transactions || []}
            income={dashboardData?.totalIncome || 0}
            userData={{
              name: dashboardData?.user?.name,
              currentStreak: 5, // Mock data - would come from backend
              budgetStreak: 2,
              noImpulseDays: 7,
              achievements: [],
              totalPoints: 150,
              lastActivity: new Date().toISOString(),
              savings: 1000,
              monthlyBudget: 2000,
              goals: ['Save for vacation', 'Pay off debt']
            }}
          />
        </div>

        {/* Charts and Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h3>
            <RecentTransactions
              transactions={dashboardData?.recentTransactions}
              onSeeMore={() => navigate("/expense")}
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Financial Overview</h3>
            <FinanceOverview
              totalBalance = {dashboardData?.totalBalance || 0}
              totalIncome = {dashboardData?.totalIncome || 0}
              totalExpense = {dashboardData?.totalExpenses || 0}
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Analysis</h3>
            <ExpenseTransactions
              transactions={dashboardData?.last30DaysExpenses?.transactions || []}
              onSeeMore={() => navigate("/expense")}
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">30-Day Expense Trend</h3>
            <Last30DaysExpenses
              data = {dashboardData?.last30DaysExpenses?.transactions || []}
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Income Chart</h3>
            <RecentIncomeWithChart
              data = {dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
              totalIncome = {dashboardData?.totalIncome || 0}
            />
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Income</h3>
            <RecentIncome
              transactions = {dashboardData?.last60DaysIncome?.transactions || []}
              onSeeMore = {() => navigate("/income")}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Home