
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const subscription = JSON.parse(event.body);

        // Validation
        if (!subscription.endpoint) {
            return { statusCode: 400, body: "Invalid subscription" };
        }

        const { getRedisCient } = require('../utils/redis.cjs');
        const redis = getRedisCient();

        if (redis) {
            // Use SADD (Set Add) to avoid duplicates
            // We store the whole JSON string
            await redis.sadd('all_subs', JSON.stringify(subscription));
            console.log("Saved subscription to Redis:", subscription.endpoint);
        } else {
            console.log("Redis not configured. Subscription Mocked.");
        }

        return {
            statusCode: 201,
            body: JSON.stringify({ message: "Subscribed successfully" })
        };
    } catch (err) {
        console.error("Subscription error:", err);
        return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
    }
};
