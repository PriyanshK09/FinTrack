import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw, Plus, X, DollarSign, Search, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { useCurrency } from '../context/CurrencyContext';
import { formatCurrency } from '../utils/currencyUtils';
import '../styles/Investments.css';

const YAHOO_FINANCE_API = {
  baseUrl: 'https://apidojo-yahoo-finance-v1.p.rapidapi.com',
  headers: {
    'X-RapidAPI-Key': '3fc9aef922mshd15546e15b88ed9p1492f1jsnfb4fc0420ae9',
    'X-RapidAPI-Host': 'apidojo-yahoo-finance-v1.p.rapidapi.com'
  }
};

export default function Investments() {
  const { currency } = useCurrency();
  const [investments, setInvestments] = useState([]);
  const [stockSearch, setStockSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [marketNews, setMarketNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingInvestment, setIsAddingInvestment] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);

  // Add these new states
  const [visibleNews, setVisibleNews] = useState(6); // Show 6 items initially
  const [hasMore, setHasMore] = useState(true);
  const NEWS_INCREMENT = 6; // Number of news to load each time

  // Fetch user investments
  const fetchInvestments = async () => {
    try {
      const response = await axios.get('/api/investments');
      setInvestments(response.data);
    } catch (error) {
      setError('Failed to fetch investments');
    }
    setIsLoading(false);
  };

  // Search stocks
  const searchStocks = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${YAHOO_FINANCE_API.baseUrl}/auto-complete`, {
        headers: YAHOO_FINANCE_API.headers,
        params: { q: query }
      });
      setSearchResults(response.data.quotes.filter(q => q.quoteType === 'EQUITY'));
    } catch (error) {
      setError('Failed to search stocks');
    }
  };

  // Add investment
  const handleAddInvestment = async () => {
    try {
      const stockData = await axios.get(`${YAHOO_FINANCE_API.baseUrl}/stock/v2/get-summary`, {
        headers: YAHOO_FINANCE_API.headers,
        params: { symbol: selectedStock.symbol }
      });

      const newInvestment = {
        symbol: selectedStock.symbol,
        name: stockData.data.price.shortName,
        quantity: parseInt(quantity),
        purchasePrice: stockData.data.price.regularMarketPrice.raw,
        currentPrice: stockData.data.price.regularMarketPrice.raw,
        change: stockData.data.price.regularMarketChangePercent.raw
      };

      await axios.post('/api/investments', newInvestment);
      await fetchInvestments();
      setSelectedStock(null);
      setQuantity(1);
      setIsAddingInvestment(false);
    } catch (error) {
      setError('Failed to add investment');
    }
  };

  // Fetch news
  const fetchMarketNews = async () => {
    try {
      const response = await axios.get(`${YAHOO_FINANCE_API.baseUrl}/news/list`, {
        headers: YAHOO_FINANCE_API.headers,
        params: { category: 'generalnews', region: 'US' }
      });
      setMarketNews(response.data.items.result);
    } catch (error) {
      setError('Failed to fetch market news');
    }
  };

  // Add this function to handle loading more news
  const handleLoadMore = () => {
    const nextVisible = visibleNews + NEWS_INCREMENT;
    setVisibleNews(nextVisible);
    if (nextVisible >= marketNews.length) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
    fetchMarketNews();
    
    const intervalId = setInterval(() => {
      if (investments.length > 0) {
        fetchInvestments();
      }
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="investments-container">
      <motion.main className="investments-main">
        {error && <div className="error-message">{error}</div>}
        
        <header className="investments-header">
          <h1>Investment Portfolio</h1>
          <button onClick={() => setIsAddingInvestment(true)} className="add-button">
            <Plus /> Add Stock
          </button>
        </header>

        {/* Stock Search Modal */}
        <AnimatePresence>
          {isAddingInvestment && (
            <motion.div 
              className="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h2>{selectedStock ? 'Add Quantity' : 'Search Stocks'}</h2>
                  <button onClick={() => {
                    setIsAddingInvestment(false);
                    setSelectedStock(null);
                  }}><X /></button>
                </div>

                {!selectedStock ? (
                  <>
                    <div className="search-container">
                      <Search />
                      <input
                        type="text"
                        value={stockSearch}
                        onChange={(e) => {
                          setStockSearch(e.target.value);
                          searchStocks(e.target.value);
                        }}
                        placeholder="Search stocks..."
                      />
                    </div>
                    <div className="search-results">
                      {searchResults.map(stock => (
                        <div 
                          key={stock.symbol}
                          className="search-result-item"
                          onClick={() => setSelectedStock(stock)}
                        >
                          <span className="stock-symbol">{stock.symbol}</span>
                          <span className="stock-name">{stock.shortname}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="quantity-selector">
                    <h3>{selectedStock.shortname} ({selectedStock.symbol})</h3>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Enter quantity"
                    />
                    <div className="modal-buttons">
                      <button onClick={handleAddInvestment}>Add Investment</button>
                      <button onClick={() => setSelectedStock(null)}>Back</button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Market News Section */}
        <section className="market-news">
          <h2>Market News</h2>
          <div className="news-grid">
            {marketNews.slice(0, visibleNews).map(news => (
              <div 
                key={news.uuid} 
                className="news-card"
                onClick={() => setSelectedNews(news)}
              >
                <div className="news-image">
                  <img 
                    src={news.main_image?.original_url || '/placeholder.jpg'} 
                    alt={news.title}
                    onError={(e) => e.target.src = '/placeholder.jpg'}
                  />
                </div>
                <div className="news-preview">
                  <h3>{news.title}</h3>
                  <ExternalLink size={16} />
                </div>
              </div>
            ))}
          </div>
          {hasMore && marketNews.length > visibleNews && (
            <motion.button
              className="load-more-button"
              onClick={handleLoadMore}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              Load More News
            </motion.button>
          )}
        </section>

        {/* News Modal */}
        <AnimatePresence>
          {selectedNews && (
            <motion.div 
              className="modal news-modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <button onClick={() => setSelectedNews(null)}><X /></button>
                </div>
                <div className="news-detail">
                  <img 
                    src={selectedNews.main_image?.original_url || '/placeholder.jpg'} 
                    alt={selectedNews.title}
                  />
                  <h2>{selectedNews.title}</h2>
                  <p>{selectedNews.summary}</p>
                  <a 
                    href={selectedNews.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="read-more"
                  >
                    Read Full Article <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.main>
    </div>
  );
}