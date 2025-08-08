import React, { useState } from 'react';
import Modal from '../Modal';
import gamificationService from '../../services/gamificationService';

const AchievementsModal = ({ isOpen, onClose, userData }) => {
  const [activeTab, setActiveTab] = useState('available'); // 'available', 'completed', 'progress'

  const allAchievements = gamificationService.achievements;
  const userAchievements = userData?.achievements || [];
  const userLevel = gamificationService.calculateLevel(userData);

  const completedAchievements = allAchievements.filter(achievement => 
    userAchievements.includes(achievement.id)
  );

  const availableAchievements = allAchievements.filter(achievement => 
    !userAchievements.includes(achievement.id)
  );

  const getAchievementProgress = (achievement) => {
    const userDataForCheck = {
      expenseCount: userData?.expenseCount || 0,
      savingsRate: userData?.savingsRate || 0,
      streak: userData?.currentStreak || 0,
      budgetStreak: userData?.budgetStreak || 0,
      categoryCount: userData?.categoryCount || 0,
      earlyLogs: userData?.earlyLogs || 0,
      noImpulseDays: userData?.noImpulseDays || 0
    };

    // Calculate progress for each achievement type
    switch (achievement.id) {
      case 'first_expense':
        return userDataForCheck.expenseCount >= 1 ? 100 : 0;
      case 'savings_master':
        return Math.min(100, (userDataForCheck.savingsRate / 20) * 100);
      case 'streak_7':
        return Math.min(100, (userDataForCheck.streak / 7) * 100);
      case 'streak_30':
        return Math.min(100, (userDataForCheck.streak / 30) * 100);
      case 'budget_keeper':
        return Math.min(100, (userDataForCheck.budgetStreak / 3) * 100);
      case 'category_explorer':
        return Math.min(100, (userDataForCheck.categoryCount / 8) * 100);
      case 'early_bird':
        return Math.min(100, (userDataForCheck.earlyLogs / 5) * 100);
      case 'no_impulse':
        return Math.min(100, (userDataForCheck.noImpulseDays / 14) * 100);
      default:
        return 0;
    }
  };

  const renderAchievementCard = (achievement, isCompleted = false) => {
    const progress = getAchievementProgress(achievement);
    
    return (
      <div key={achievement.id} className={`p-4 border rounded-lg ${
        isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className="text-2xl">{achievement.icon}</div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-800">{achievement.title}</h4>
              <span className="text-sm font-medium text-purple-600">+{achievement.points} pts</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
            
            {!isCompleted && (
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500">{Math.round(progress)}% complete</p>
              </div>
            )}
            
            {isCompleted && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm">✓ Completed</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Achievements">
      <div className="space-y-4">
        {/* User Level Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800">Your Progress</h4>
              <p className="text-2xl font-bold text-purple-600">Level {userLevel.level}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">{userLevel.totalPoints} points</p>
              <p className="text-xs text-gray-500">
                {userLevel.pointsToNextLevel} pts to next level
              </p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${userLevel.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'available' 
                ? 'border-purple-500 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Available ({availableAchievements.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'completed' 
                ? 'border-purple-500 text-purple-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed ({completedAchievements.length})
          </button>
        </div>

        {/* Achievement Lists */}
        <div className="max-h-96 overflow-y-auto space-y-3">
          {activeTab === 'available' && (
            <>
              {availableAchievements.length > 0 ? (
                availableAchievements.map(achievement => 
                  renderAchievementCard(achievement, false)
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>All achievements completed! 🎉</p>
                  <p className="text-sm mt-1">You're a financial master!</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'completed' && (
            <>
              {completedAchievements.length > 0 ? (
                completedAchievements.map(achievement => 
                  renderAchievementCard(achievement, true)
                )
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No achievements completed yet</p>
                  <p className="text-sm mt-1">Start tracking your expenses to earn achievements!</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AchievementsModal; 