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
    // 1. Fetch News (Reuse fetch-rss logic or call the endpoint)
    // Note: Calling the own endpoint might fail if auth/network issues, better to share logic. 
    // For simplicity, we assume we fetch from the deployed endpoint or localhost.

    // In a real scheduled function, we would require the logic directly.
    // Here we will Mock the news fetching for the TEST requested by User.

    // MOCK NEWS ITEM for "Road closure in Bad Wörishofen"
    const newsItem = {
        title: 'Achtung: Straßensperrung in Bad Wörishofen ab Montag',
        content: 'Wegen Bauarbeiten ist die Hauptstraße gesperrt.',
        url: 'https://bad-woerishofen.info/fake-news'
    };

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
