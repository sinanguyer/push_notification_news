const Parser = require('rss-parser');
const cheerio = require('cheerio');
const fetch = require('node-fetch'); // Netlify Functions runtime usually supplies this globally or via node-fetch

const parser = new Parser();

const SOURCES = [
    {
        id: 'zbfs',
        name: 'ZBFS',
        url: 'https://www.zbfs.bayern.de/behoerde/presse/',
        type: 'html',
        selector: '.content-main', // Approximation, to be refined
    },
    {
        id: 'stmas',
        name: 'StMAS',
        url: 'https://www.stmas.bayern.de/presse/',
        type: 'html',
    },
    {
        id: 'lfr',
        name: 'Landesfamilienrat',
        url: 'https://landesfamilienrat.de/feed/', // Common WP Feed
        type: 'rss',
    },
    {
        id: 'bamf',
        name: 'BAMF',
        url: 'https://www.bamf.de/SiteGlobals/Functions/RSS/DE/Feed/RSS_Aktuelles.xml', // Deduced standard pattern
        type: 'rss',
    },
    {
        id: 'stmi',
        name: 'StMI Bayern',
        url: 'https://www.stmi.bayern.de/service/rss/pressemitteilungen.xml', // Common Bayern Portal pattern
        type: 'rss',
    },
    {
        id: 'km',
        name: 'KM Bayern',
        url: 'https://www.km.bayern.de/rss/pressemitteilungen.xml', // Common pattern
        type: 'rss',
    },
    {
        id: 'vzb',
        name: 'Verbraucherzentrale Bayern',
        url: 'https://www.verbraucherzentrale-bayern.de/presse',
        type: 'html',
    },
    {
        id: 'lra_ua',
        name: 'Landratsamt Unterallgäu',
        url: 'https://www.landratsamt-unterallgaeu.de/aktuelles/pressemitteilungen',
        type: 'html',
    }
];

const fetchRSS = async (source) => {
    try {
        const feed = await parser.parseURL(source.url);
        return feed.items.map(item => ({
            title: item.title,
            link: item.link,
            pubDate: item.pubDate,
            content: item.contentSnippet || item.content,
            source: source.name,
            id: item.guid || item.link
        }));
    } catch (error) {
        console.error(`Error fetching RSS for ${source.name}:`, error.message);
        return [];
    }
};

const fetchHTML = async (source) => {
    try {
        const response = await fetch(source.url);
        const html = await response.text();
        const $ = cheerio.load(html);
        const items = [];

        // Generic scraping logic - Customized by source would be better but starting generic
        // Looking for lists of news items

        if (source.id === 'zbfs') {
            // Example for ZBFS - finding links in main content
            // This is a placeholder logic based on common patterns.
            $('a').each((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                if (href && (href.includes('pressemitteilung') || href.includes('2025') || href.includes('2026'))) {
                    if (text.length > 20) { // Filter out "more", "2025" etc.
                        items.push({
                            title: text,
                            link: href.startsWith('http') ? href : `https://www.zbfs.bayern.de${href}`,
                            pubDate: new Date().toISOString(), // No date in snippet
                            content: '',
                            source: source.name,
                            id: href
                        });
                    }
                }
            });
        } else {
            // Fallback or other HTML sources
            // We'll return empty for now to avoid garbage until we implement specific selectors
        }

        return items.slice(0, 10); // Limit
    } catch (error) {
        console.error(`Error fetching HTML for ${source.name}:`, error.message);
        return [];
    }
};

exports.handler = async (event, context) => {
    try {
        const promises = SOURCES.map(source => {
            if (source.type === 'rss') {
                return fetchRSS(source);
            } else {
                return fetchHTML(source);
            }
        });

        const results = await Promise.all(promises);
        const allNews = results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // CORS
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allNews)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
