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
  const [subscription, setSubscription] = useState(null);

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

  const subscribeUser = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const register = await navigator.serviceWorker.register('/sw.js');
        const subscription = await register.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        });

        // Send subscription to backend
        await fetch('/api/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setSubscription(subscription); // Save for testing
        alert("Subscribed!");
      } catch (e) {
        console.error("Subscription failed", e);
        alert("Subscription failed: " + e.message);
      }
    } else {
      alert("Service Worker not supported");
    }
  };

  const sendTestNotification = async () => {
    if (!subscription) {
      alert("Please enable push notifications first!");
      return;
    }
    try {
      const res = await fetch('/api/test-notification', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error');
      }
      alert("Test sent! Check your notifications.");
    } catch (e) {
      alert("Failed to send test: " + e.message);
    }
  };

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
          <button onClick={subscribeUser} className="absolute right-4 top-4 text-xs bg-blue-600 px-2 py-1 rounded text-white">
            🔔 Enable Push
          </button>
          {subscription && (
            <button onClick={sendTestNotification} className="absolute right-28 top-4 text-xs bg-green-600 px-2 py-1 rounded text-white mr-2">
              🚀 Test Push
            </button>
          )}

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

const PUBLIC_VAPID_KEY = 'BLwgy8VcZILQhZObCHC4Fa21bfF3K_oIiRek1o5JiJwNJG3Bzoii0ky8DcON7ugKOoChSgJaXnGPLgoJlPtu-lw';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default App;


