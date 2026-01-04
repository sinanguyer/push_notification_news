// Google Translation API URL (would normally be backend-proxied to hide key)
// For now, we will simulate or use a client-side call if a key was present. 
// User instruction: "Use the 'Google Cloud Translation API' ... or similar free library"
// Since we don't have a key, we'll mock it for the 'Verification' phase or check local storage.

const CACHE_KEY = 'news_translations';

const getCache = () => {
    try {
        return JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
    } catch {
        return {};
    }
};

const setCache = (cache) => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const translateText = async (text, targetLang) => {
    if (targetLang === 'de') return text; // Original

    const cache = getCache();
    // Create a hash-like key (simple version)
    const cacheId = `${targetLang}_${text.substring(0, 30).replace(/\s/g, '')}_${text.length}`;

    if (cache[cacheId]) {
        return cache[cacheId];
    }

    try {
        const response = await fetch('/api/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, targetLang }),
        });

        if (!response.ok) throw new Error('Translation failed');

        const data = await response.json();
        const translatedResult = data.translatedText;

        // Update Cache
        cache[cacheId] = translatedResult;
        setCache(cache);

        return translatedResult;
    } catch (error) {
        console.error("Translation Service Error:", error);
        return text; // Fallback to original
    }
};

