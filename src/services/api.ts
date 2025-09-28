// API service for fetching live market data and AI analysis

interface BraveSearchResult {
  title: string;
  url: string;
  description: string;
  published?: string;
}

interface BraveSearchResponse {
  web?: {
    results: BraveSearchResult[];
  };
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class APIService {
  private braveApiKey: string;
  private braveBaseUrl: string;
  private groqApiKey: string;

  constructor() {
    this.braveApiKey = import.meta.env.VITE_BRAVE_API_KEY;
    this.braveBaseUrl = import.meta.env.VITE_BRAVE_BASE_URL;
    this.groqApiKey = import.meta.env.VITE_GROQ_API_KEY;
  }

  async searchMarketData(query: string): Promise<BraveSearchResult[]> {
    try {
      const response = await fetch(`${this.braveBaseUrl}?q=${encodeURIComponent(query)}&count=10`, {
        headers: {
          'X-Subscription-Token': this.braveApiKey,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Brave Search API error: ${response.status}`);
      }

      const data: BraveSearchResponse = await response.json();
      return data.web?.results || [];
    } catch (error) {
      console.error('Error fetching market data:', error);
      return [];
    }
  }

  async getAIAnalysis(prompt: string): Promise<string> {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'moonshotai/kimi-k2-instruct-0905',
          messages: [{
            role: 'system',
            content: 'You are FinAdvisor AI, a professional investment advisor specializing in Kenyan markets. Provide clear, data-driven investment advice. Always include the disclaimer: "I am not a licensed financial advisor. This is educational information only."'
          }, {
            role: 'user',
            content: prompt
          }],
          max_tokens: 1000,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate analysis at this time.';
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      return 'Unable to generate analysis at this time. Please try again later.';
    }
  }

  async getNSEStockData(symbol: string) {
    const searchQuery = `NSE ${symbol} stock price Kenya current market data`;
    const searchResults = await this.searchMarketData(searchQuery);
    
    // Extract relevant information from search results
    const relevantData = searchResults.slice(0, 5).map(result => ({
      title: result.title,
      description: result.description,
      url: result.url
    }));

    // Get AI analysis of the search results
    const analysisPrompt = `
    Analyze this NSE stock data for ${symbol} and provide investment insights:
    
    Search Results:
    ${relevantData.map(item => `- ${item.title}: ${item.description}`).join('\n')}
    
    Please provide:
    1. Current price estimate (if available)
    2. Recent performance analysis
    3. Investment recommendation (buy/hold/sell)
    4. Risk assessment
    5. Key factors affecting the stock
    
    Focus on Kenyan market context and economic factors.
    `;

    const analysis = await this.getAIAnalysis(analysisPrompt);

    return {
      symbol,
      searchResults: relevantData,
      analysis,
      timestamp: new Date().toISOString()
    };
  }

  async getKenyanMarketOverview() {
    const searchQuery = 'NSE Nairobi Securities Exchange market performance today Kenya stocks';
    const searchResults = await this.searchMarketData(searchQuery);
    
    const relevantData = searchResults.slice(0, 8).map(result => ({
      title: result.title,
      description: result.description,
      url: result.url
    }));

    const analysisPrompt = `
    Analyze the current Kenyan stock market conditions based on this data:
    
    ${relevantData.map(item => `- ${item.title}: ${item.description}`).join('\n')}
    
    Please provide:
    1. Overall market sentiment
    2. Key market movers
    3. Economic factors affecting the market
    4. Investment opportunities
    5. Risk factors to watch
    
    Focus on actionable insights for Kenyan investors.
    `;

    const analysis = await this.getAIAnalysis(analysisPrompt);

    return {
      searchResults: relevantData,
      analysis,
      timestamp: new Date().toISOString()
    };
  }

  async getFinancialPlanningAdvice(userProfile: any) {
    const prompt = `
    Provide personalized financial planning advice for a Kenyan investor with this profile:
    
    Age: ${userProfile.age}
    Income: KES ${userProfile.income}
    Risk Tolerance: ${userProfile.riskTolerance}
    Investment Goals: ${userProfile.goals}
    Time Horizon: ${userProfile.timeHorizon} years
    Current Savings: KES ${userProfile.currentSavings}
    
    Consider Kenyan investment options like:
    - NSE stocks (Safaricom, Equity Bank, KCB, etc.)
    - Government securities (Treasury Bills, Bonds)
    - Money market funds
    - Real estate investment
    - Pension schemes (NSSF, private pension)
    
    Provide specific allocation recommendations and explain the reasoning.
    `;

    return await this.getAIAnalysis(prompt);
  }

  async getPortfolioAnalysis(holdings: any[]) {
    const holdingsData = holdings.map(h => `${h.symbol}: ${h.shares} shares at KES ${h.currentPrice}`).join(', ');
    
    const prompt = `
    Analyze this Kenyan stock portfolio and provide recommendations:
    
    Holdings: ${holdingsData}
    
    Please assess:
    1. Portfolio diversification across sectors
    2. Risk level and concentration
    3. Performance relative to NSE index
    4. Rebalancing recommendations
    5. Additional stocks to consider
    
    Focus on Kenyan market dynamics and provide actionable advice.
    `;

    return await this.getAIAnalysis(prompt);
  }
}

export const apiService = new APIService();