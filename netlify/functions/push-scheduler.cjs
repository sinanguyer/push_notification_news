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

    // 2. Filter Logic
    const importantNews = allNews.filter(item => {
        return KEYWORDS.some(k => item.title.includes(k) || (item.content && item.content.includes(k)));
    });

    if (importantNews.length > 0) {
        console.log(`Found ${importantNews.length} important items. Preparing to send...`);

        // 3. Fetch Subscriptions from Redis
        const { getRedisCient } = require('../utils/redis.cjs');
        const redis = getRedisCient();

        if (!redis) {
            console.log("No Redis. Skipping send.");
            return { statusCode: 200, body: "No DB configured" };
        }

        const subsStrings = await redis.smembers('all_subs');
        console.log(`Found ${subsStrings.length} subscribers.`);

        // 4. Send Notifications
        const payload = JSON.stringify({
            title: `New Alert: ${importantNews[0].title}`,
            body: importantNews[0].title, // Use title as body for brevity in push
            url: '/' // TODO: Link to specific news item if possible
        });

        const sendPromises = subsStrings.map(async (subStr) => {
            let sub;
            try {
                sub = JSON.parse(subStr);
                await webpush.sendNotification(sub, payload);
                return { success: true };
            } catch (err) {
                if (err.statusCode === 410 || err.statusCode === 404) {
                    console.log("Subscription expired/gone. Removing from DB.");
                    await redis.srem('all_subs', subStr);
                } else {
                    console.error("Failed to send push:", err.message);
                }
                return { success: false };
            }
        });

        await Promise.all(sendPromises);
        console.log("Finished sending notifications.");
    } else {
        console.log("No important news found this run.");
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Scheduler ran", processed: true })
    };
};
```
