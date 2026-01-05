
const { Redis } = require('@upstash/redis');

// Initialize Redis from Environment Variables
// If variables are missing, it will throw an error (or we can handle gracefully)
const getRedisCient = () => {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        console.warn("Redis Credentials missing from ENV. Real persistence disabled.");
        return null;
    }

    return new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
};

module.exports = { getRedisCient };
