import React, { useState } from 'react';
import Modal from '../Modal';

const SavingsGoalModal = ({ isOpen, onClose, currentSavingsRate, onSave }) => {
  const [goalType, setGoalType] = useState('percentage');
  const [goalValue, setGoalValue] = useState(20);
  const [goalName, setGoalName] = useState('');
  const [targetDate, setTargetDate] = useState('');

  const handleSave = () => {
    const goal = {
      type: goalType,
      value: goalValue,
      name: goalName,
      targetDate: targetDate,
      currentRate: currentSavingsRate
    };
    onSave(goal);
    onClose();
  };

  const getRecommendedGoal = () => {
    if (currentSavingsRate < 10) return 15;
    if (currentSavingsRate < 20) return 25;
    return 30;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Set Savings Goal">
      <div className="space-y-4">
        {/* Current Status */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-1">Current Savings Rate</h4>
          <p className="text-2xl font-bold text-blue-600">{currentSavingsRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-600 mt-1">
            {currentSavingsRate < 10 ? 'You can improve your savings rate!' :
             currentSavingsRate < 20 ? 'Good progress! Let\'s aim higher.' :
             'Excellent! You\'re on the right track.'}
          </p>
        </div>

        {/* Goal Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="percentage"
                checked={goalType === 'percentage'}
                onChange={(e) => setGoalType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Savings Rate (%)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="amount"
                checked={goalType === 'amount'}
                onChange={(e) => setGoalType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Monthly Savings Amount ($)</span>
            </label>
          </div>
        </div>

        {/* Goal Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {goalType === 'percentage' ? 'Target Savings Rate (%)' : 'Monthly Savings Goal ($)'}
          </label>
          <input
            type="number"
            value={goalValue}
            onChange={(e) => setGoalValue(Number(e.target.value))}
            min={goalType === 'percentage' ? 1 : 1}
            max={goalType === 'percentage' ? 100 : 10000}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder={goalType === 'percentage' ? '20' : '500'}
          />
          {goalType === 'percentage' && (
            <p className="text-xs text-gray-500 mt-1">
              Recommended: {getRecommendedGoal()}% (based on your current rate)
            </p>
          )}
        </div>

        {/* Goal Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Goal Name (Optional)
          </label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., Emergency Fund, Vacation Savings"
          />
        </div>

        {/* Target Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Date (Optional)
          </label>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Quick Goal Suggestions */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Quick Goals</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setGoalType('percentage');
                setGoalValue(20);
                setGoalName('Emergency Fund');
              }}
              className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50"
            >
              Emergency Fund (20%)
            </button>
            <button
              onClick={() => {
                setGoalType('percentage');
                setGoalValue(30);
                setGoalName('Aggressive Savings');
              }}
              className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50"
            >
              Aggressive (30%)
            </button>
            <button
              onClick={() => {
                setGoalType('amount');
                setGoalValue(500);
                setGoalName('Monthly Savings');
              }}
              className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50"
            >
              $500/month
            </button>
            <button
              onClick={() => {
                setGoalType('amount');
                setGoalValue(1000);
                setGoalName('High Savings');
              }}
              className="p-2 text-xs border border-gray-200 rounded hover:bg-gray-50"
            >
              $1000/month
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
          >
            Set Goal
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SavingsGoalModal; 