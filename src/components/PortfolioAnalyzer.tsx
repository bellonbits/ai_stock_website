import React, { useState } from 'react';
import { PieChart, BarChart3, TrendingUp, Shield, AlertTriangle, Plus, X, DollarSign } from 'lucide-react';
import { apiService } from '../services/api';

interface Holding {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

interface PortfolioMetrics {
  totalValue: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  riskScore: number;
  diversificationScore: number;
}

const PortfolioAnalyzer: React.FC = () => {
  const [holdings, setHoldings] = useState<Holding[]>([
    { symbol: 'AAPL', shares: 50, avgPrice: 150.00, currentPrice: 192.53 },
    { symbol: 'MSFT', shares: 25, avgPrice: 300.00, currentPrice: 418.24 },
    { symbol: 'GOOGL', shares: 15, avgPrice: 100.00, currentPrice: 138.21 }
  ]);
  
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    shares: '',
    avgPrice: ''
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  const calculateMetrics = (): PortfolioMetrics => {
    let totalValue = 0;
    let totalCost = 0;
    
    holdings.forEach(holding => {
      totalValue += holding.shares * holding.currentPrice;
      totalCost += holding.shares * holding.avgPrice;
    });
    
    const totalGainLoss = totalValue - totalCost;
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;
    
    // Simple risk and diversification scoring (0-100)
    const riskScore = Math.min(100, Math.max(0, 50 + (totalGainLossPercent * 2)));
    const diversificationScore = Math.min(100, holdings.length * 20);
    
    return {
      totalValue,
      totalGainLoss,
      totalGainLossPercent,
      riskScore,
      diversificationScore
    };
  };

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.avgPrice) return;
    
    // Mock current price (in production, fetch from API)
    const mockCurrentPrices: Record<string, number> = {
      'AAPL': 192.53,
      'MSFT': 418.24,
      'GOOGL': 138.21,
      'TSLA': 238.45,
      'AMZN': 155.89,
      'NVDA': 722.48
    };
    
    const currentPrice = mockCurrentPrices[newHolding.symbol.toUpperCase()] || parseFloat(newHolding.avgPrice);
    
    setHoldings([...holdings, {
      symbol: newHolding.symbol.toUpperCase(),
      shares: parseFloat(newHolding.shares),
      avgPrice: parseFloat(newHolding.avgPrice),
      currentPrice
    }]);
    
    setNewHolding({ symbol: '', shares: '', avgPrice: '' });
    setShowAddForm(false);
  };

  const removeHolding = (index: number) => {
    setHoldings(holdings.filter((_, i) => i !== index));
  };

  const getAIPortfolioAnalysis = async () => {
    if (holdings.length === 0) return;
    
    setLoadingAnalysis(true);
    try {
      const analysis = await apiService.getPortfolioAnalysis(holdings);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('Error getting portfolio analysis:', error);
      setAiAnalysis('Unable to generate analysis at this time. Please try again later.');
    } finally {
      setLoadingAnalysis(false);
    }
  };
  const metrics = calculateMetrics();

  const getPortfolioAllocation = () => {
    const totalValue = metrics.totalValue;
    return holdings.map(holding => ({
      ...holding,
      value: holding.shares * holding.currentPrice,
      allocation: ((holding.shares * holding.currentPrice) / totalValue) * 100
    }));
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-emerald-400 bg-emerald-500/20';
    if (score < 70) return 'text-yellow-400 bg-yellow-500/20';
    return 'text-red-400 bg-red-500/20';
  };

  const allocation = getPortfolioAllocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Portfolio Analyzer</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Comprehensive portfolio analysis with performance metrics, risk assessment, and optimization recommendations.
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-6 h-6 text-blue-400" />
                <span className="text-gray-400 text-sm">Total Value</span>
              </div>
              <div className="text-2xl font-bold text-white">${metrics.totalValue.toLocaleString()}</div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className={`w-6 h-6 ${metrics.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`} />
                <span className="text-gray-400 text-sm">Total P&L</span>
              </div>
              <div className={`text-2xl font-bold ${metrics.totalGainLoss >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${metrics.totalGainLoss.toLocaleString()} ({metrics.totalGainLossPercent.toFixed(2)}%)
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Shield className="w-6 h-6 text-yellow-400" />
                <span className="text-gray-400 text-sm">Risk Score</span>
              </div>
              <div className={`text-2xl font-bold ${getRiskColor(metrics.riskScore).split(' ')[0]}`}>
                {metrics.riskScore.toFixed(0)}/100
              </div>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <PieChart className="w-6 h-6 text-purple-400" />
                <span className="text-gray-400 text-sm">Diversification</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">{metrics.diversificationScore}/100</div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                  Holdings
                </h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Holding
                </button>
                <button
                  onClick={getAIPortfolioAnalysis}
                  disabled={loadingAnalysis || holdings.length === 0}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-all duration-300"
                >
                  {loadingAnalysis ? 'Analyzing...' : 'AI Analysis'}
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-300 font-semibold">Symbol</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Shares</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Avg Price</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Current Price</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Market Value</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">P&L</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Allocation</th>
                    <th className="px-6 py-4 text-right text-gray-300 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {allocation.map((holding, index) => {
                    const pl = (holding.currentPrice - holding.avgPrice) * holding.shares;
                    const plPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
                    
                    return (
                      <tr key={index} className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold mr-3">
                              {holding.symbol.substring(0, 2)}
                            </div>
                            <span className="text-white font-semibold">{holding.symbol}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">{holding.shares}</td>
                        <td className="px-6 py-4 text-right text-gray-300">${holding.avgPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-gray-300">${holding.currentPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-right text-white font-semibold">${holding.value.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-right font-semibold ${pl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ${pl.toLocaleString()} ({plPercent.toFixed(2)}%)
                        </td>
                        <td className="px-6 py-4 text-right text-gray-300">{holding.allocation.toFixed(1)}%</td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeHolding(index)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Holding Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-6">Add New Holding</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Stock Symbol</label>
                  <input
                    type="text"
                    value={newHolding.symbol}
                    onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value.toUpperCase() })}
                    placeholder="AAPL"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Number of Shares</label>
                  <input
                    type="number"
                    value={newHolding.shares}
                    onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                    placeholder="100"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 mb-2">Average Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newHolding.avgPrice}
                    onChange={(e) => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                    placeholder="150.00"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-4 mt-8">
                <button
                  onClick={addHolding}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Add Holding
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Analysis & Recommendations */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* AI Portfolio Analysis */}
          {aiAnalysis && (
            <div className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-blue-400" />
                AI Portfolio Analysis
              </h3>
              <div className="space-y-4">
                {aiAnalysis.split('\n\n').map((section, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg">
                    <p className="text-gray-300 leading-relaxed">{section}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Analysis */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3 text-yellow-400" />
              Risk Analysis
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Overall Risk</span>
                  <span className={getRiskColor(metrics.riskScore).split(' ')[0]}>{metrics.riskScore < 30 ? 'Low' : metrics.riskScore < 70 ? 'Medium' : 'High'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-red-500" 
                    style={{ width: `${metrics.riskScore}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-300">Diversification</span>
                  <span className="text-purple-400">{metrics.diversificationScore < 40 ? 'Low' : metrics.diversificationScore < 80 ? 'Medium' : 'High'}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-emerald-500" 
                    style={{ width: `${metrics.diversificationScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-3 text-blue-400" />
              AI Recommendations
            </h3>
            
            <div className="space-y-4">
              {metrics.diversificationScore < 60 && (
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="font-semibold text-yellow-400 mb-2">Improve Diversification</div>
                  <div className="text-gray-300 text-sm">Consider adding holdings from different sectors or asset classes to reduce concentration risk.</div>
                </div>
              )}
              
              {allocation.some(h => h.allocation > 40) && (
                <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div className="font-semibold text-red-400 mb-2">High Concentration</div>
                  <div className="text-gray-300 text-sm">Some positions represent a large portion of your portfolio. Consider rebalancing for better risk distribution.</div>
                </div>
              )}
              
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="font-semibold text-blue-400 mb-2">Regular Rebalancing</div>
                <div className="text-gray-300 text-sm">Review and rebalance your portfolio quarterly to maintain your target allocation.</div>
              </div>
              
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <div className="font-semibold text-emerald-400 mb-2">Performance Review</div>
                <div className="text-gray-300 text-sm">Your portfolio shows {metrics.totalGainLoss >= 0 ? 'positive' : 'negative'} performance. Consider dollar-cost averaging for consistent growth.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioAnalyzer;