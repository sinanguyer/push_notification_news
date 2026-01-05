
const Parser = require('rss-parser');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

const parser = new Parser();

const SOURCES = [
    {
        id: 'zbfs',
        name: 'ZBFS',
        url: 'https://www.zbfs.bayern.de/behoerde/presse/',
        type: 'html',
        category: 'state',
        selector: '.content-main',
    },
    {
        id: 'stmas',
        name: 'StMAS',
        url: 'https://www.stmas.bayern.de/presse/',
        type: 'html',
        category: 'state',
    },
    {
        id: 'lfr',
        name: 'Landesfamilienrat',
        url: 'https://landesfamilienrat.de/feed/',
        type: 'rss',
        category: 'state',
    },
    {
        id: 'bamf',
        name: 'BAMF',
        url: 'https://www.bamf.de/SiteGlobals/Functions/RSS/DE/Feed/RSS_Aktuelles.xml',
        type: 'rss',
        category: 'state',
    },
    {
        id: 'stmi',
        name: 'StMI Bayern',
        url: 'https://www.stmi.bayern.de/service/rss/pressemitteilungen.xml',
        type: 'rss',
        category: 'state',
    },
    {
        id: 'km',
        name: 'KM Bayern',
        url: 'https://www.km.bayern.de/rss/pressemitteilungen.xml',
        type: 'rss',
        category: 'state',
    },
    {
        id: 'vzb',
        name: 'Verbraucherzentrale Bayern',
        url: 'https://www.verbraucherzentrale-bayern.de/presse',
        type: 'html',
        category: 'state',
    },
    {
        id: 'lra_ua',
        name: 'Landratsamt Unterallgäu',
        url: 'https://www.landratsamt-unterallgaeu.de/aktuelles/pressemitteilungen',
        type: 'html',
        category: 'local',
    },
    {
        id: 'memmingen',
        name: 'Stadt Memmingen',
        url: 'https://www.memmingen.de/aktuelles-service/pressemitteilungen.html',
        type: 'html',
        category: 'local',
    },
    {
        id: 'mindelheim',
        name: 'Stadt Mindelheim',
        url: 'https://www.mindelheim.de/aktuelles',
        type: 'html',
        category: 'local',
    },
    {
        id: 'landsberg',
        name: 'LRA Landsberg am Lech',
        url: 'https://www.landkreis-landsberg.de/aktuelles/pressemitteilungen/',
        type: 'html',
        category: 'local',
    },
    {
        id: 'tagesschau',
        name: 'Tagesschau (General)',
        url: 'https://www.tagesschau.de/xml/rss2',
        type: 'rss',
        category: 'general',
    },
    {
        id: 'bad_woerishofen_news',
        name: 'Stadt Bad Wörishofen (News)',
        url: 'https://www.bad-woerishofen.info/aktuelles/nachrichten/',
        type: 'html',
        category: 'local',
    },
    {
        id: 'bad_woerishofen_presse',
        name: 'Stadt Bad Wörishofen (Presse)',
        url: 'https://www.bad-woerishofen.de/service/presse',
        type: 'html',
        category: 'local',
    },
    {
        id: 'lra_unterallgaeu_presse',
        name: 'LRA Unterallgäu',
        url: 'https://www.landratsamt-unterallgaeu.de/aktuelles/pressemitteilungen',
        type: 'html',
        category: 'local',
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
            category: source.category,
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

        if (source.id === 'zbfs') {
            $('a').each((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                if (href && (href.includes('pressemitteilung') || href.includes('2025') || href.includes('2026'))) {
                    if (text.length > 20) {
                        items.push({
                            title: text,
                            link: href.startsWith('http') ? href : `https://www.zbfs.bayern.de${href}`,
                            pubDate: new Date().toISOString(),
                            content: '',
                            source: source.name,
                            category: source.category,
                            id: href
                        });
                    }
                }
            });
        } else if (source.id === 'bad_woerishofen_news') {
            $('a[href*="/detail/"]').each((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                if (text && href) {
                    items.push({
                        title: text.replace(/\s+/g, ' ').substring(0, 150),
                        link: href.startsWith('http') ? href : `https://www.bad-woerishofen.info${href}`,
                        pubDate: new Date().toISOString(),
                        content: 'Bad Wörishofen News',
                        source: source.name,
                        category: source.category,
                        id: href
                    });
                }
            });
        } else if (source.id === 'bad_woerishofen_presse') {
            $('a[href*=".pdf"]').each((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                if (text && href && !text.includes('Datenschutz')) {
                    items.push({
                        title: text,
                        link: href.startsWith('http') ? href : `https://www.bad-woerishofen.de${href}`,
                        pubDate: new Date().toISOString(),
                        content: 'Pressemitteilung (PDF)',
                        source: source.name,
                        category: source.category,
                        id: href
                    });
                }
            });
        } else if (source.id === 'lra_unterallgaeu_presse') {
            $('h3 a').each((i, el) => {
                const text = $(el).text().trim();
                const href = $(el).attr('href');
                if (text && href) {
                    items.push({
                        title: text,
                        link: href.startsWith('http') ? href : `https://www.landratsamt-unterallgaeu.de${href}`,
                        pubDate: new Date().toISOString(),
                        content: 'Landratsamt Unterallgäu',
                        source: source.name,
                        category: source.category,
                        id: href
                    });
                }
            });
        } else {
            // Basic Fallback or other specific logic
        }

        return items.slice(0, 10);
    } catch (error) {
        console.error(`Error fetching HTML for ${source.name}:`, error.message);
        return [];
    }
};

const fetchAllNews = async () => {
    const promises = SOURCES.map(source => {
        if (source.type === 'rss') {
            return fetchRSS(source);
        } else {
            return fetchHTML(source);
        }
    });

    const results = await Promise.all(promises);
    return results.flat().sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
};

module.exports = { fetchAllNews };
