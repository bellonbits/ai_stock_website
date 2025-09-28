import React, { useState } from 'react';
import { TrendingUp, Shield, Calculator, PieChart, BarChart3, Users, Star, ChevronRight, DollarSign, Target, BookOpen, Phone, Mail, MapPin } from 'lucide-react';
import StockResearch from './components/StockResearch';
import PortfolioAnalyzer from './components/PortfolioAnalyzer';
import FinancialPlanning from './components/FinancialPlanning';
import MarketDashboard from './components/MarketDashboard';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'research':
        return <StockResearch />;
      case 'portfolio':
        return <PortfolioAnalyzer />;
      case 'planning':
        return <FinancialPlanning />;
      case 'market':
        return <MarketDashboard />;
      default:
        return <HomePage />;
    }
  };

  const HomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-red-600/10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/10 backdrop-blur-sm border border-green-500/20 text-green-400 text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4 mr-2" />
                AI-Powered Investment Intelligence for Kenya
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Your <span className="bg-gradient-to-r from-green-400 to-red-400 bg-clip-text text-transparent">Trusted</span>
                <br />Kenyan Investment Partner
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Professional investment advisory for Kenyan investors. Get NSE market data, 
                personalized portfolio recommendations, and expert financial planning guidance in KES.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => setActiveTab('research')}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore NSE Stocks
                </button>
                <button 
                  onClick={() => setActiveTab('planning')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Financial Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Investment Solutions for Kenya</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              From NSE stocks to government bonds, we provide all the tools Kenyan investors need for successful wealth building.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "NSE Stock Research",
                description: "Real-time Nairobi Securities Exchange data, analysis, and AI-powered recommendations",
                color: "from-green-500 to-green-600"
              },
              {
                icon: <PieChart className="w-8 h-8" />,
                title: "Portfolio Analysis",
                description: "Comprehensive portfolio evaluation with risk assessment optimized for Kenyan markets",
                color: "from-red-500 to-red-600"
              },
              {
                icon: <Calculator className="w-8 h-8" />,
                title: "Financial Planning",
                description: "Personalized strategies for retirement, education, and wealth goals in KES",
                color: "from-amber-500 to-amber-600"
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Risk Management",
                description: "Advanced risk analysis considering Kenyan economic factors and market volatility",
                color: "from-blue-500 to-blue-600"
              }
            ].map((feature, index) => (
              <div key={index} className="group p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kenyan Investment Options */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Popular Kenyan Investment Options</h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore the best investment opportunities available to Kenyan investors
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "NSE Listed Stocks",
                description: "Safaricom, Equity Bank, KCB Group, EABL, and other blue-chip companies",
                returns: "8-15% annually",
                risk: "Medium to High",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Government Securities",
                description: "Treasury Bills, Treasury Bonds with guaranteed returns from CBK",
                returns: "12-16% annually",
                risk: "Low",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Money Market Funds",
                description: "CIC, Britam, Old Mutual money market funds for liquidity",
                returns: "8-12% annually",
                risk: "Low to Medium",
                color: "from-purple-500 to-pink-500"
              }
            ].map((option, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 hover:border-slate-600 transition-all duration-300">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center text-white font-bold text-xl mb-6`}>
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{option.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{option.description}</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expected Returns:</span>
                    <span className="text-green-400 font-semibold">{option.returns}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk Level:</span>
                    <span className="text-yellow-400 font-semibold">{option.risk}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "KES 500B+", label: "NSE Market Cap Analyzed" },
              { number: "10K+", label: "Kenyan Investment Strategies" },
              { number: "99.8%", label: "Data Accuracy" },
              { number: "24/7", label: "Market Monitoring" }
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-red-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Build Wealth in Kenya?</h2>
          <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of Kenyan investors who trust FinAdvisor AI for their financial success.
          </p>
          <button 
            onClick={() => setActiveTab('research')}
            className="px-8 py-4 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start Investing Today
          </button>
        </div>
      </section>

      {/* Disclaimer */}
      <footer className="py-8 bg-slate-900 border-t border-slate-700">
        <div className="container mx-auto px-6">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              <strong>Disclaimer:</strong> I am not a licensed financial advisor in Kenya. This is educational information only.
            </p>
            <p>© 2025 FinAdvisor AI Kenya. All rights reserved. Please verify all information with CMA-licensed advisors before making investment decisions.</p>
          </div>
        </div>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-red-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinAdvisor AI Kenya</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              {[
                { id: 'home', label: 'Home' },
                { id: 'research', label: 'NSE Research' },
                { id: 'portfolio', label: 'Portfolio' },
                { id: 'planning', label: 'Planning' },
                { id: 'market', label: 'Market' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === item.id
                      ? 'text-green-400 bg-green-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;