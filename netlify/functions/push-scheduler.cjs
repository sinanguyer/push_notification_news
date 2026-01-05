
const webpush = require('web-push');
const fetch = require('node-fetch'); // or global fetch if avail

// Public/Private Keys (Cleaned to ensure Standard Base64 for web-push/atob compatibility)
const cleanPublic = 'BPmFvLBRVcLMLlu-6WLczxUbIDZ-FCD-HU4RVwD24gEzDNU225LlcLQjIHlgMEvc_mseZEZjltC5IkvxGb_0oI0'
    .replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (4 - 'BPmFvLBRVcLMLlu-6WLczxUbIDZ-FCD-HU4RVwD24gEzDNU225LlcLQjIHlgMEvc_mseZEZjltC5IkvxGb_0oI0'.length % 4) % 4);

const cleanPrivate = '9-yySpkz7HrEI_uCDaxpz2KnTBcI1dqlsZ4mAHYMDDs'
    .replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (4 - '9-yySpkz7HrEI_uCDaxpz2KnTBcI1dqlsZ4mAHYMDDs'.length % 4) % 4);

webpush.setVapidDetails(
    'mailto:test@test.com',
    cleanPublic,
    cleanPrivate
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
