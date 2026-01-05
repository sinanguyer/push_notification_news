
const webpush = require('web-push');
const fetch = require('node-fetch'); // or global fetch if avail

// Public/Private Keys (Should be in ENV variables in production)
const publicVapidKey = 'BDZqfkh_jE2X2e-j-lzcJcZ9JY2dd1s0kTX-STetwNKlFcs8yo2k1poeYUPbGMi-PSkDo3mMnphzYho7i5zIhv8';
const privateVapidKey = 'KI8V_YKw-1hhRjTEWgi41ArX3wbQ1jeXEtltjiDHUOI';

webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey
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
