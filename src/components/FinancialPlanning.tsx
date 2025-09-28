import React, { useState } from 'react';
import { Calculator, Target, PiggyBank, TrendingUp, Calendar, DollarSign, Percent, Clock } from 'lucide-react';
import { apiService } from '../services/api';

interface FinancialGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
  monthlyContribution: number;
  timeHorizon: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

interface PlanningResult {
  monthsToGoal: number;
  totalContributions: number;
  expectedReturns: number;
  recommendedAllocation: {
    stocks: number;
    bonds: number;
    cash: number;
  };
}

const FinancialPlanning: React.FC = () => {
  const [activeCalculator, setActiveCalculator] = useState<'retirement' | 'goal' | 'compound' | 'advisor'>('retirement');
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  
  // Retirement Calculator State
  const [retirementData, setRetirementData] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    expectedReturn: 7,
    currentIncome: 75000,
    replaceIncome: 80
  });

  // Goal Calculator State
  const [goalData, setGoalData] = useState({
    goalName: 'House Down Payment',
    targetAmount: 100000,
    currentAmount: 20000,
    monthlyContribution: 2000,
    timeHorizon: 36,
    riskTolerance: 'moderate' as const
  });

  // Compound Interest Calculator State
  const [compoundData, setCompoundData] = useState({
    principal: 10000,
    monthlyContribution: 500,
    annualReturn: 8,
    years: 20
  });

  // AI Advisor State
  const [advisorProfile, setAdvisorProfile] = useState({
    age: 30,
    income: 100000,
    currentSavings: 50000,
    riskTolerance: 'moderate' as 'conservative' | 'moderate' | 'aggressive',
    goals: 'retirement',
    timeHorizon: 20
  });

  const getPersonalizedAdvice = async () => {
    setLoadingAdvice(true);
    try {
      const advice = await apiService.getFinancialPlanningAdvice(advisorProfile);
      setAiAdvice(advice);
    } catch (error) {
      console.error('Error getting advice:', error);
      setAiAdvice('Unable to generate advice at this time. Please try again later.');
    } finally {
      setLoadingAdvice(false);
    }
  };

  const calculateRetirement = () => {
    const yearsToRetirement = retirementData.retirementAge - retirementData.currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = retirementData.expectedReturn / 100 / 12;
    
    // Future value of current savings
    const futureCurrentSavings = retirementData.currentSavings * Math.pow(1 + retirementData.expectedReturn / 100, yearsToRetirement);
    
    // Future value of monthly contributions
    const futureContributions = retirementData.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn);
    
    const totalAtRetirement = futureCurrentSavings + futureContributions;
    const neededIncome = (retirementData.currentIncome * retirementData.replaceIncome) / 100;
    const annualNeed = neededIncome;
    const neededCapital = annualNeed * 25; // 4% rule
    
    return {
      totalAtRetirement,
      neededCapital,
      surplus: totalAtRetirement - neededCapital,
      monthlyIncomeAtRetirement: totalAtRetirement * 0.04 / 12
    };
  };

  const calculateGoal = (): PlanningResult => {
    const remaining = goalData.targetAmount - goalData.currentAmount;
    const monthsToGoal = Math.ceil(remaining / goalData.monthlyContribution);
    
    const returnRates = {
      conservative: 4,
      moderate: 7,
      aggressive: 10
    };
    
    const expectedReturn = returnRates[goalData.riskTolerance];
    const monthlyReturn = expectedReturn / 100 / 12;
    
    // Future value calculation with compound interest
    const futureValue = goalData.currentAmount * Math.pow(1 + expectedReturn / 100, goalData.timeHorizon / 12) +
      goalData.monthlyContribution * ((Math.pow(1 + monthlyReturn, goalData.timeHorizon) - 1) / monthlyReturn);
    
    const allocations = {
      conservative: { stocks: 30, bonds: 60, cash: 10 },
      moderate: { stocks: 60, bonds: 30, cash: 10 },
      aggressive: { stocks: 80, bonds: 15, cash: 5 }
    };
    
    return {
      monthsToGoal,
      totalContributions: goalData.monthlyContribution * goalData.timeHorizon,
      expectedReturns: futureValue - goalData.currentAmount - (goalData.monthlyContribution * goalData.timeHorizon),
      recommendedAllocation: allocations[goalData.riskTolerance]
    };
  };

  const calculateCompound = () => {
    const monthlyReturn = compoundData.annualReturn / 100 / 12;
    const months = compoundData.years * 12;
    
    // Future value of principal
    const futurePrincipal = compoundData.principal * Math.pow(1 + compoundData.annualReturn / 100, compoundData.years);
    
    // Future value of monthly contributions
    const futureContributions = compoundData.monthlyContribution * 
      ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    
    const totalValue = futurePrincipal + futureContributions;
    const totalContributions = compoundData.principal + (compoundData.monthlyContribution * months);
    const totalEarnings = totalValue - totalContributions;
    
    return {
      totalValue,
      totalContributions,
      totalEarnings,
      returnMultiple: totalValue / totalContributions
    };
  };

  const retirementResults = calculateRetirement();
  const goalResults = calculateGoal();
  const compoundResults = calculateCompound();

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'conservative': return 'text-emerald-400 bg-emerald-500/20';
      case 'aggressive': return 'text-red-400 bg-red-500/20';
      default: return 'text-yellow-400 bg-yellow-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Financial Planning Center</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive financial planning tools to help you achieve your goals with personalized strategies and calculations.
          </p>
        </div>

        {/* Calculator Navigation */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { id: 'retirement', label: 'Retirement Planning', icon: <PiggyBank className="w-5 h-5" /> },
              { id: 'goal', label: 'Goal Calculator', icon: <Target className="w-5 h-5" /> },
              { id: 'compound', label: 'Compound Interest', icon: <TrendingUp className="w-5 h-5" /> },
              { id: 'advisor', label: 'AI Financial Advisor', icon: <Calculator className="w-5 h-5" /> }
            ].map((calc) => (
              <button
                key={calc.id}
                onClick={() => setActiveCalculator(calc.id as any)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCalculator === calc.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                {calc.icon}
                <span className="ml-2">{calc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Retirement Planning Calculator */}
        {activeCalculator === 'retirement' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <PiggyBank className="w-6 h-6 mr-3 text-blue-400" />
                  Retirement Planning
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Current Age</label>
                      <input
                        type="number"
                        value={retirementData.currentAge}
                        onChange={(e) => setRetirementData({ ...retirementData, currentAge: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Retirement Age</label>
                      <input
                        type="number"
                        value={retirementData.retirementAge}
                        onChange={(e) => setRetirementData({ ...retirementData, retirementAge: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Current Savings (KES)</label>
                    <input
                      type="number"
                      value={retirementData.currentSavings}
                      onChange={(e) => setRetirementData({ ...retirementData, currentSavings: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Monthly Contribution (KES)</label>
                    <input
                      type="number"
                      value={retirementData.monthlyContribution}
                      onChange={(e) => setRetirementData({ ...retirementData, monthlyContribution: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Expected Return (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={retirementData.expectedReturn}
                        onChange={(e) => setRetirementData({ ...retirementData, expectedReturn: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Income Replacement (%)</label>
                      <input
                        type="number"
                        value={retirementData.replaceIncome}
                        onChange={(e) => setRetirementData({ ...retirementData, replaceIncome: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Retirement Projection</h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-semibold">Total at Retirement</span>
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {retirementResults.totalAtRetirement.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-400 font-semibold">Monthly Retirement Income</span>
                      <Calendar className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {retirementResults.monthlyIncomeAtRetirement.toLocaleString()}</div>
                  </div>
                  
                  <div className={`p-6 rounded-xl border ${retirementResults.surplus >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-semibold ${retirementResults.surplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {retirementResults.surplus >= 0 ? 'Surplus' : 'Shortfall'}
                      </span>
                      <TrendingUp className={`w-6 h-6 ${retirementResults.surplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                    </div>
                    <div className={`text-3xl font-bold ${retirementResults.surplus >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      KES {Math.abs(retirementResults.surplus).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-yellow-400 font-semibold mb-2">Recommendation</div>
                    <div className="text-gray-300 text-sm">
                      {retirementResults.surplus >= 0 
                        ? 'You\'re on track for retirement! Consider increasing contributions to build more security.'
                        : 'Consider increasing monthly contributions or extending your working years to meet retirement goals.'
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Goal Calculator */}
        {activeCalculator === 'goal' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-emerald-400" />
                  Goal Calculator
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Goal Name</label>
                    <input
                      type="text"
                      value={goalData.goalName}
                      onChange={(e) => setGoalData({ ...goalData, goalName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Target Amount (KES)</label>
                      <input
                        type="number"
                        value={goalData.targetAmount}
                        onChange={(e) => setGoalData({ ...goalData, targetAmount: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Current Amount (KES)</label>
                      <input
                        type="number"
                        value={goalData.currentAmount}
                        onChange={(e) => setGoalData({ ...goalData, currentAmount: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Monthly Contribution (KES)</label>
                      <input
                        type="number"
                        value={goalData.monthlyContribution}
                        onChange={(e) => setGoalData({ ...goalData, monthlyContribution: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Time Horizon (months)</label>
                      <input
                        type="number"
                        value={goalData.timeHorizon}
                        onChange={(e) => setGoalData({ ...goalData, timeHorizon: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Risk Tolerance</label>
                    <select
                      value={goalData.riskTolerance}
                      onChange={(e) => setGoalData({ ...goalData, riskTolerance: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="conservative">Conservative (4% return)</option>
                      <option value="moderate">Moderate (7% return)</option>
                      <option value="aggressive">Aggressive (10% return)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Goal Projection</h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-400 font-semibold">Months to Goal</span>
                      <Clock className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">{goalResults.monthsToGoal} months</div>
                    <div className="text-gray-300 mt-2">({(goalResults.monthsToGoal / 12).toFixed(1)} years)</div>
                  </div>
                  
                  <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-semibold">Total Contributions</span>
                      <DollarSign className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {goalResults.totalContributions.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-purple-400 font-semibold">Expected Returns</span>
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {goalResults.expectedReturns.toLocaleString()}</div>
                  </div>

                  <div className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-semibold mb-4">Recommended Allocation</div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Stocks</span>
                        <span className="text-white font-semibold">{goalResults.recommendedAllocation.stocks}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Bonds</span>
                        <span className="text-white font-semibold">{goalResults.recommendedAllocation.bonds}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Cash</span>
                        <span className="text-white font-semibold">{goalResults.recommendedAllocation.cash}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Compound Interest Calculator */}
        {activeCalculator === 'compound' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input Form */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-3 text-purple-400" />
                  Compound Interest
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Initial Investment (KES)</label>
                    <input
                      type="number"
                      value={compoundData.principal}
                      onChange={(e) => setCompoundData({ ...compoundData, principal: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Monthly Contribution (KES)</label>
                    <input
                      type="number"
                      value={compoundData.monthlyContribution}
                      onChange={(e) => setCompoundData({ ...compoundData, monthlyContribution: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Annual Return (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={compoundData.annualReturn}
                        onChange={(e) => setCompoundData({ ...compoundData, annualReturn: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Time Period (years)</label>
                      <input
                        type="number"
                        value={compoundData.years}
                        onChange={(e) => setCompoundData({ ...compoundData, years: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">Compound Growth</h3>
                
                <div className="space-y-6">
                  <div className="p-6 bg-purple-500/10 rounded-xl border border-purple-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-purple-400 font-semibold">Final Value</span>
                      <DollarSign className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {compoundResults.totalValue.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 bg-blue-500/10 rounded-xl border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-semibold">Total Contributions</span>
                      <Calculator className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {compoundResults.totalContributions.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-6 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-emerald-400 font-semibold">Total Earnings</span>
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-3xl font-bold text-white">KES {compoundResults.totalEarnings.toLocaleString()}</div>
                  </div>
                  
                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-yellow-400 font-semibold mb-2">Growth Multiple</div>
                    <div className="text-2xl font-bold text-white">{compoundResults.returnMultiple.toFixed(2)}x</div>
                    <div className="text-gray-300 text-sm mt-2">
                      Your money will grow to {compoundResults.returnMultiple.toFixed(2)} times your total contributions
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Financial Advisor */}
        {activeCalculator === 'advisor' && (
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Input */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Calculator className="w-6 h-6 mr-3 text-green-400" />
                  Your Financial Profile
                </h2>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 mb-2">Age</label>
                      <input
                        type="number"
                        value={advisorProfile.age}
                        onChange={(e) => setAdvisorProfile({ ...advisorProfile, age: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-2">Monthly Income (KES)</label>
                      <input
                        type="number"
                        value={advisorProfile.income}
                        onChange={(e) => setAdvisorProfile({ ...advisorProfile, income: Number(e.target.value) })}
                        className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Current Savings (KES)</label>
                    <input
                      type="number"
                      value={advisorProfile.currentSavings}
                      onChange={(e) => setAdvisorProfile({ ...advisorProfile, currentSavings: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Risk Tolerance</label>
                    <select
                      value={advisorProfile.riskTolerance}
                      onChange={(e) => setAdvisorProfile({ ...advisorProfile, riskTolerance: e.target.value as any })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="conservative">Conservative - Preserve capital</option>
                      <option value="moderate">Moderate - Balanced growth</option>
                      <option value="aggressive">Aggressive - Maximum growth</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Primary Investment Goal</label>
                    <input
                      type="text"
                      value={advisorProfile.goals}
                      onChange={(e) => setAdvisorProfile({ ...advisorProfile, goals: e.target.value })}
                      placeholder="e.g., retirement, house, education"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">Time Horizon (years)</label>
                    <input
                      type="number"
                      value={advisorProfile.timeHorizon}
                      onChange={(e) => setAdvisorProfile({ ...advisorProfile, timeHorizon: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  
                  <button
                    onClick={getPersonalizedAdvice}
                    disabled={loadingAdvice}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300"
                  >
                    {loadingAdvice ? 'Generating Advice...' : 'Get Personalized Advice'}
                  </button>
                </div>
              </div>

              {/* AI Advice */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-white mb-6">AI Financial Advisor</h3>
                
                {loadingAdvice ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-300">Analyzing your profile and generating personalized advice...</p>
                    </div>
                  </div>
                ) : aiAdvice ? (
                  <div className="space-y-4">
                    {aiAdvice.split('\n\n').map((section, index) => (
                      <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                        <p className="text-gray-300 leading-relaxed">{section}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">Fill out your profile and click "Get Personalized Advice" to receive AI-powered investment recommendations tailored for Kenyan investors.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialPlanning;