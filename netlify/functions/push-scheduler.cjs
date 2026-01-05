const webpush = require('web-push');
const fetch = require('node-fetch'); // or global fetch if avail

// Public/Private Keys
webpush.setVapidDetails(
    'mailto:sinan@bavarianews.app',
    'BFdE0U_Os0l3nRfYIOJtVl76V0B9sBSKKXTzfMcDEvfa06tL_w05jIJNCIbizsl6xOjS70VMP5Tpl-qw8l-06aA',
    'ZMWyOS9phIv1EZ_7jffPb-5V7B4uU_fRI_nAXSu8Uo0'
);

const KEYWORDS = [
    'Bad Wörishofen', 'Mindelheim', 'Straßensperrung', 'Ausländerbehörde',
    'Müllabfuhr', 'Wasser', 'Kita', 'Kindergarten'
];

exports.handler = async (event, context) => {
    // 1. Fetch Real News
    const { fetchAllNews } = require('../utils/news-fetcher.cjs');
    let allNews = [];
    try {
        allNews = await fetchAllNews();
        console.log(`Scheduler fetched ${allNews.length} items`);
    } catch (e) {
        console.error("Failed to fetch news:", e);
        return { statusCode: 500, body: "News fetch failed" };
    }

    // 2. Filter for Keywords (Last 24h only ideally, but for now just check latest)
    // In real app, we check if item.pubDate > lastRunTime

    const importantNews = allNews.filter(item => {
        return KEYWORDS.some(k => item.title.includes(k) || (item.content && item.content.includes(k)));
    });

    if (importantNews.length > 0) {
        console.log(`Found ${importantNews.length} important items:`, importantNews.map(i => i.title));
        // TODO: Retrieve Subscriptions from Redis and Send
    } else {
        console.log("No important news found this run.");
    }

    // Filter Logic
    const isImportant = KEYWORDS.some(k => newsItem.title.includes(k) || newsItem.content.includes(k));

    if (isImportant) {
        // Retrieve Subscriptions (Mocked for now)
        // In real app: const subs = await redis.smembers('subs');

        // Payload
        const payload = JSON.stringify({
            title: `New Alert: ${newsItem.title}`,
            body: newsItem.content,
            url: newsItem.url
        });

        // We can't actually SEND to a real subscription without a real endpoint.
        // But we can log that we WOULD send.
        console.log("Push Logic: Found important keynews:", newsItem.title);

        // If we had a subscription passed in event (mock test), we could send.
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Scheduler ran", processed: true })
    };
};
