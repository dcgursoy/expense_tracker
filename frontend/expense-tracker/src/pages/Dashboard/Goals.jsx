import React, { useState, useEffect } from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import Modal from '../../components/Modal';
import { 
  IoMdAdd, 
  IoMdCheckmark, 
  IoMdTrendingUp, 
  IoMdCalendar,
  IoMdWallet,
  IoMdHome,
  IoMdCar,
  IoMdSchool,
  IoMdHeart
} from 'react-icons/io';
import { addThousandsSeparator } from '../../utils/helper';

const Goals = () => {
  useUserAuth();
  const [goals, setGoals] = useState([]);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'savings',
    description: ''
  });

  useEffect(() => {
    // Load mock goals data
    setGoals([
      {
        id: 1,
        title: 'Emergency Fund',
        targetAmount: 10000,
        currentAmount: 6500,
        targetDate: '2024-12-31',
        category: 'savings',
        description: 'Build a 6-month emergency fund',
        icon: IoMdWallet,
        color: 'from-green-500 to-green-600'
      },
      {
        id: 2,
        title: 'Vacation Fund',
        targetAmount: 5000,
        currentAmount: 3200,
        targetDate: '2024-06-15',
        category: 'travel',
        description: 'Save for summer vacation',
        icon: IoMdHeart,
        color: 'from-blue-500 to-blue-600'
      },
      {
        id: 3,
        title: 'New Car',
        targetAmount: 25000,
        currentAmount: 8500,
        targetDate: '2025-03-01',
        category: 'vehicle',
        description: 'Down payment for a new car',
        icon: IoMdCar,
        color: 'from-purple-500 to-purple-600'
      },
      {
        id: 4,
        title: 'Home Renovation',
        targetAmount: 15000,
        currentAmount: 4200,
        targetDate: '2024-08-30',
        category: 'home',
        description: 'Kitchen and bathroom renovation',
        icon: IoMdHome,
        color: 'from-orange-500 to-orange-600'
      }
    ]);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      savings: IoMdWallet,
      travel: IoMdHeart,
      vehicle: IoMdCar,
      home: IoMdHome,
      education: IoMdSchool,
      other: IoMdTrendingUp
    };
    return icons[category] || IoMdTrendingUp;
  };

  const getCategoryColor = (category) => {
    const colors = {
      savings: 'from-green-500 to-green-600',
      travel: 'from-blue-500 to-blue-600',
      vehicle: 'from-purple-500 to-purple-600',
      home: 'from-orange-500 to-orange-600',
      education: 'from-indigo-500 to-indigo-600',
      other: 'from-gray-500 to-gray-600'
    };
    return colors[category] || 'from-gray-500 to-gray-600';
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatus = (goal) => {
    const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
    const daysRemaining = getDaysRemaining(goal.targetDate);
    
    if (progress >= 100) return { status: 'Completed', color: 'text-green-600', bg: 'bg-green-100' };
    if (daysRemaining < 0) return { status: 'Overdue', color: 'text-red-600', bg: 'bg-red-100' };
    if (progress >= 75) return { status: 'On Track', color: 'text-green-600', bg: 'bg-green-100' };
    if (progress >= 50) return { status: 'Good Progress', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (progress >= 25) return { status: 'Started', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Just Started', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.targetDate) {
      alert('Please fill in all required fields');
      return;
    }

    const goal = {
      id: Date.now(),
      ...newGoal,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: parseFloat(newGoal.currentAmount) || 0,
      icon: getCategoryIcon(newGoal.category),
      color: getCategoryColor(newGoal.category)
    };

    setGoals([...goals, goal]);
    setNewGoal({
      title: '',
      targetAmount: '',
      currentAmount: '',
      targetDate: '',
      category: 'savings',
      description: ''
    });
    setShowAddGoal(false);
  };

  const updateGoalProgress = (goalId, newAmount) => {
    setGoals(goals.map(goal => 
      goal.id === goalId 
        ? { ...goal, currentAmount: Math.min(newAmount, goal.targetAmount) }
        : goal
    ));
  };

  return (
    <DashboardLayout activeMenu="Goals">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Financial Goals 🎯
          </h1>
          <p className="text-gray-600">Track your progress towards financial milestones</p>
        </div>

        {/* Add Goal Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
          >
            <IoMdAdd className="text-xl" />
            Add New Goal
          </button>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.targetDate);
            const status = getStatus(goal);
            const IconComponent = goal.icon;

            return (
              <div key={goal.id} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${goal.color}`}>
                      <IconComponent className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{goal.title}</h3>
                      <p className="text-sm text-gray-500">{goal.category}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full bg-gradient-to-r ${goal.color} transition-all duration-300`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Amounts */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current</span>
                    <span className="font-semibold text-gray-900">
                      ${addThousandsSeparator(goal.currentAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target</span>
                    <span className="font-semibold text-gray-900">
                      ${addThousandsSeparator(goal.targetAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="font-semibold text-gray-900">
                      ${addThousandsSeparator(goal.targetAmount - goal.currentAmount)}
                    </span>
                  </div>
                </div>

                {/* Date and Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <IoMdCalendar />
                    <span>{daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}</span>
                  </div>
                  <button
                    onClick={() => setSelectedGoal(goal)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Update Progress
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Goal Modal */}
        <Modal isOpen={showAddGoal} onClose={() => setShowAddGoal(false)} title="Add New Goal">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal Title</label>
              <input
                type="text"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., Emergency Fund"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="savings">Savings</option>
                <option value="travel">Travel</option>
                <option value="vehicle">Vehicle</option>
                <option value="home">Home</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target Amount ($)</label>
                <input
                  type="number"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Amount ($)</label>
                <input
                  type="number"
                  value={newGoal.currentAmount}
                  onChange={(e) => setNewGoal({...newGoal, currentAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Date</label>
              <input
                type="date"
                value={newGoal.targetDate}
                onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
              <textarea
                value={newGoal.description}
                onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Describe your goal..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowAddGoal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </Modal>

        {/* Update Progress Modal */}
        <Modal isOpen={!!selectedGoal} onClose={() => setSelectedGoal(null)} title="Update Progress">
          {selectedGoal && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{selectedGoal.title}</h4>
                <p className="text-sm text-gray-600">Current: ${addThousandsSeparator(selectedGoal.currentAmount)} / ${addThousandsSeparator(selectedGoal.targetAmount)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Current Amount ($)</label>
                <input
                  type="number"
                  defaultValue={selectedGoal.currentAmount}
                  onChange={(e) => updateGoalProgress(selectedGoal.id, parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="flex-1 px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Goals; 