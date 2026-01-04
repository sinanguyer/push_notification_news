import { useState, useEffect } from 'react';
import { Newspaper, Settings, Info } from 'lucide-react';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';
import { fetchNews } from './services/api';

function App() {
  const [view, setView] = useState('list'); // 'list', 'detail'
  const [news, setNews] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    setLoading(true);
    try {
      const data = await fetchNews();
      setNews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setView('detail');
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setView('list');
  };

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-10 bg-[#0f172a]/95 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-blue-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
            Bavaria Family
          </h1>
        </div>
      </header>

      <main className="p-4">
        {loading ? (
          <div className="flex justify-center p-8 text-slate-400">Loading updates...</div>
        ) : (
          <>
            {view === 'list' && (
              <NewsList news={news} onArticleClick={handleArticleClick} />
            )}
            {view === 'detail' && selectedArticle && (
              <NewsDetail article={selectedArticle} onBack={handleBack} />
            )}
          </>
        )}
      </main>

      {/* Navigation Bar (Mobile Style) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-700 p-3 max-w-[600px] mx-auto flex justify-around">
        <button className="flex flex-col items-center gap-1 !bg-transparent !p-0 text-blue-400">
          <Newspaper size={20} />
          <span className="text-xs">News</span>
        </button>
        <button className="flex flex-col items-center gap-1 !bg-transparent !p-0 text-slate-400 hover:text-slate-200">
          <Info size={20} />
          <span className="text-xs">About</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
