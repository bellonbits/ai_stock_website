import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, DollarSign, BarChart3, AlertCircle, Star, Calendar, Target, ExternalLink, Loader, RefreshCw, Activity } from 'lucide-react';

interface NSEStock {
  Ticker: string;
  Name: string;
  Volume: number;
  Price: number;
  Change: number;
}

interface StockData {
  stock: NSEStock;
  analysis: string;
  timestamp: string;
}

const StockResearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [allStocks, setAllStocks] = useState<NSEStock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Fetch all NSE stocks on component mount
  useEffect(() => {
    fetchAllStocks();
  }, []);

  const fetchAllStocks = async () => {
    try {
      const response = await fetch('http://4.222.216.225:8002/nse');
      if (!response.ok) {
        throw new Error('Failed to fetch NSE data');
      }
      const stocks = await response.json();
      setAllStocks(stocks);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching NSE data:', err);
      setError('Failed to load NSE data. Please check your connection.');
    }
  };

  const generateAIAnalysis = (stock: NSEStock): string => {
    const changePercent = ((stock.Change / (stock.Price - stock.Change)) * 100).toFixed(2);
    const isPositive = stock.Change > 0;
    const volumeStatus = stock.Volume > 100000 ? 'High' : stock.Volume > 10000 ? 'Moderate' : 'Low';
    
    return `Current Trading Analysis for ${stock.Name} (${stock.Ticker}):

The stock is currently trading at KES ${stock.Price.toFixed(2)}, showing a ${isPositive ? 'positive' : stock.Change < 0 ? 'negative' : 'neutral'} movement of ${changePercent}% (KES ${stock.Change.toFixed(2)}) from the previous session.

Volume Analysis: Today's trading volume stands at ${stock.Volume.toLocaleString()} shares, indicating ${volumeStatus.toLowerCase()} investor interest. ${stock.Volume > 100000 ? 'High volume suggests strong market participation and liquidity.' : stock.Volume === 0 ? 'No trading activity recorded, which may indicate low liquidity or market closure.' : 'Moderate volume suggests steady but not exceptional trading activity.'}

Technical Overview: ${isPositive ? 'The positive price movement suggests bullish sentiment in the short term. Investors may be responding to favorable market conditions or company-specific news.' : stock.Change < 0 ? 'The price decline indicates bearish pressure. This could be due to profit-taking, market-wide corrections, or company-specific concerns.' : 'The stock shows price stability with no significant movement, suggesting equilibrium between buyers and sellers.'}

Market Context: As part of the Nairobi Securities Exchange, this stock operates within Kenya's evolving financial landscape. Consider broader economic factors including interest rates, inflation, and sector-specific developments when making investment decisions.

Risk Considerations: ${stock.Volume === 0 ? 'Zero volume indicates potential liquidity risks.' : stock.Volume < 10000 ? 'Lower trading volume may present liquidity challenges for large positions.' : 'Adequate liquidity supports easier position entry and exit.'}`;
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Refresh data to ensure we have latest prices
      await fetchAllStocks();
      
      const foundStock = allStocks.find(stock => 
        stock.Ticker.toUpperCase() === searchTerm.toUpperCase()
      );
      
      if (!foundStock) {
        setError(`Stock symbol "${searchTerm.toUpperCase()}" not found in NSE listings.`);
        setLoading(false);
        return;
      }
      
      const analysis = generateAIAnalysis(foundStock);
      
      setStockData({
        stock: foundStock,
        analysis,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      setError('Failed to fetch stock data. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAnalysis = (analysis: string) => {
    const sections = analysis.split('\n\n');
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        <p className="text-gray-300 leading-relaxed">{section}</p>
      </div>
    ));
  };

  const getTopMovers = () => {
    return allStocks
      .filter(stock => stock.Change !== 0)
      .sort((a, b) => Math.abs(b.Change) - Math.abs(a.Change))
      .slice(0, 6);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">NSE Stock Research Center</h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Get real-time analysis of Nairobi Securities Exchange stocks with live data and AI-powered insights.
          </p>
          {lastUpdated && (
            <div className="mt-4 flex items-center justify-center text-sm text-gray-400">
              <Activity className="w-4 h-4 mr-2" />
              Data last updated: {lastUpdated.toLocaleTimeString()}
              <button 
                onClick={fetchAllStocks}
                className="ml-4 text-green-400 hover:text-green-300 flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Enter NSE stock symbol (e.g., SCOM, EQTY, KCB, EABL)"
              className="w-full px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-600 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pl-14"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
            <button
              onClick={handleSearch}
              disabled={loading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 text-white font-semibold rounded-xl transition-all duration-300 flex items-center"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Analyze'
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {stockData && (
          <div className="max-w-6xl mx-auto">
            {/* Stock Header */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {stockData.stock.Ticker}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">{stockData.stock.Name}</h2>
                    <div className="text-gray-400 text-sm">
                      NSE: {stockData.stock.Ticker}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white mb-2">
                    KES {stockData.stock.Price.toFixed(2)}
                  </div>
                  <div className={`flex items-center justify-end ${
                    stockData.stock.Change > 0 ? 'text-green-400' : 
                    stockData.stock.Change < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {stockData.stock.Change > 0 ? <TrendingUp className="w-5 h-5 mr-1" /> : 
                     stockData.stock.Change < 0 ? <TrendingDown className="w-5 h-5 mr-1" /> : null}
                    {stockData.stock.Change > 0 ? '+' : ''}{stockData.stock.Change.toFixed(2)}
                    <span className="ml-2 text-sm">
                      ({((stockData.stock.Change / (stockData.stock.Price - stockData.stock.Change)) * 100).toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Trading Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Volume</div>
                  <div className="text-white font-semibold">{stockData.stock.Volume.toLocaleString()}</div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Change</div>
                  <div className={`font-semibold ${
                    stockData.stock.Change > 0 ? 'text-green-400' : 
                    stockData.stock.Change < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    KES {stockData.stock.Change.toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Previous Close</div>
                  <div className="text-white font-semibold">
                    KES {(stockData.stock.Price - stockData.stock.Change).toFixed(2)}
                  </div>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <div className="text-gray-400 text-sm mb-1">Market Cap</div>
                  <div className="text-white font-semibold">N/A</div>
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-green-400" />
                AI Investment Analysis
              </h3>
              <div className="space-y-4">
                {formatAnalysis(stockData.analysis)}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                <div className="text-sm text-gray-300">
                  <strong className="text-yellow-400">Investment Disclaimer:</strong> This analysis is for educational purposes only and should not be considered as financial advice. 
                  Always conduct your own research and consult with CMA-licensed professionals before making investment decisions. 
                  Past performance does not guarantee future results. Consider your risk tolerance and investment objectives.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Movers */}
        {!stockData && !loading && allStocks.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">Top Market Movers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getTopMovers().map((stock) => (
                <div
                  key={stock.Ticker}
                  onClick={() => { 
                    setSearchTerm(stock.Ticker); 
                    setTimeout(() => handleSearch(), 100);
                  }}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 cursor-pointer hover:border-green-500/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {stock.Ticker}
                    </div>
                    <div className={`flex items-center ${
                      stock.Change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.Change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    </div>
                  </div>
                  <div className="text-white font-semibold mb-1 text-sm leading-tight">{stock.Name}</div>
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-white font-bold">KES {stock.Price.toFixed(2)}</div>
                    <div className={`text-sm ${
                      stock.Change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {stock.Change > 0 ? '+' : ''}{stock.Change.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-gray-400 text-xs">
                    Volume: {stock.Volume.toLocaleString()} • Click for analysis
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockResearch;