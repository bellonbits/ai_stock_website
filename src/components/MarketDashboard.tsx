import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Globe, DollarSign, Percent, Activity, RefreshCw, ExternalLink, Loader } from 'lucide-react';
import { apiService } from '../services/api';

interface MarketOverview {
  searchResults: Array<{
    title: string;
    description: string;
    url: string;
  }>;
  analysis: string;
  timestamp: string;
}

const MarketDashboard: React.FC = () => {
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getKenyanMarketOverview();
      setMarketData(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  const formatAnalysis = (analysis: string) => {
    const sections = analysis.split('\n\n');
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        <p className="text-gray-300 leading-relaxed">{section}</p>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-8 pb-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4">Kenyan Market Dashboard</h1>
            <p className="text-gray-300 text-lg">
              Real-time NSE market data and insights powered by AI analysis.
            </p>
          </div>
          <div className="mt-6 md:mt-0 flex items-center space-x-4">
            {lastUpdated && (
              <div className="text-gray-400 text-sm">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={fetchMarketData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-all duration-300"
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Updating...' : 'Refresh'}
            </button>
          </div>
        </div>

        {loading && !marketData && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
              <p className="text-gray-300">Fetching live market data...</p>
            </div>
          </div>
        )}

        {marketData && (
          <div className="space-y-8">
            {/* Market Analysis */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-3 text-green-400" />
                AI Market Analysis
              </h2>
              <div className="space-y-4">
                {formatAnalysis(marketData.analysis)}
              </div>
            </div>

            {/* Live Market News & Data */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Market News */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-red-400" />
                  Live Market News
                </h2>
                <div className="space-y-4">
                  {marketData.searchResults.slice(0, 6).map((news, index) => (
                    <div key={index} className="p-4 rounded-lg border border-slate-600/50 bg-slate-700/30">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-white font-semibold text-sm leading-tight pr-4">
                          {news.title}
                        </h3>
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-400 hover:text-green-300 flex-shrink-0"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {news.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Market Indicators */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-yellow-400" />
                  Key Market Factors
                </h2>
                
                <div className="space-y-6">
                  <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-green-400 font-semibold">NSE Performance</span>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-gray-300 text-sm">
                      Track NSE 20 Share Index and All Share Index performance
                    </div>
                  </div>

                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-blue-400 font-semibold">CBK Interest Rates</span>
                      <Percent className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-gray-300 text-sm">
                      Central Bank of Kenya policy rates affecting investment returns
                    </div>
                  </div>

                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-red-400 font-semibold">Currency Impact</span>
                      <DollarSign className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="text-gray-300 text-sm">
                      KES/USD exchange rate effects on market performance
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                    <div className="text-yellow-400 font-semibold mb-3">Investment Climate</div>
                    <div className="text-white text-sm leading-relaxed">
                      Current economic conditions and their impact on Kenyan investment opportunities.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular NSE Stocks */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-green-400" />
                Popular NSE Stocks
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { symbol: 'SCOM', name: 'Safaricom PLC', sector: 'Telecommunications' },
                  { symbol: 'EQTY', name: 'Equity Group Holdings', sector: 'Banking' },
                  { symbol: 'KCB', name: 'KCB Group PLC', sector: 'Banking' },
                  { symbol: 'EABL', name: 'East African Breweries', sector: 'Consumer Goods' },
                  { symbol: 'BAMB', name: 'Bamburi Cement', sector: 'Construction' },
                  { symbol: 'COOP', name: 'Co-operative Bank', sector: 'Banking' }
                ].map((stock, index) => (
                  <div key={index} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {stock.symbol.substring(0, 2)}
                      </div>
                      <div className="text-gray-400 text-xs">{stock.sector}</div>
                    </div>
                    <div className="text-white font-semibold mb-1">{stock.symbol}</div>
                    <div className="text-gray-300 text-sm">{stock.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 p-6 bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl">
          <div className="text-center text-gray-300 text-sm">
            <p className="mb-2">
              <strong>Market Data Disclaimer:</strong> All market data is for informational purposes only and may be delayed. 
              I am not a licensed financial advisor. Please verify all information independently before making investment decisions.
            </p>
            <p>Market data sourced from live web searches and analyzed by AI for educational purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketDashboard;