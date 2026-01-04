import { useState, useEffect } from 'react';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './services/api';
import { Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState(null);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('all'); // 'all', 'general', 'state', 'local'

  useEffect(() => {
    const getNewsData = async () => {
      try {
        const data = await fetchNews();
        setNews(data);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    getNewsData();
  }, []);

  const filteredNews = category === 'all'
    ? news
    : news.filter(item => item.category === category);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-lg backdrop-blur-sm bg-opacity-90">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            News
          </h1>

          {/* Category Tabs - Only show on list view */}
          {!selectedNews && (
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {['all', 'general', 'state', 'local'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                    }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
            <Loader2 size={32} className="animate-spin text-blue-500" />
            <p>Loading latest updates...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-8 bg-slate-900 rounded-lg border border-red-900/50">
            {error}
          </div>
        ) : (
          <>
            {/* List View - Hidden via CSS when detail is open to preserve scroll */}
            <div style={{ display: selectedNews ? 'none' : 'block' }}>
              <NewsList news={filteredNews} onArticleClick={setSelectedNews} />
            </div>

            {/* Detail View */}
            {selectedNews && (
              <NewsDetail
                article={selectedNews}
                onBack={() => setSelectedNews(null)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
