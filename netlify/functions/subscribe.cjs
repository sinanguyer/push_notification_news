
exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const subscription = JSON.parse(event.body);
    console.log("Accepted Subscription:", subscription);

    // TODO: In a real app, save 'subscription' to Upstash Redis or Database
    // const redis = new Redis(process.env.REDIS_URL);
    // await redis.set('sub:' + subscription.endpoint, JSON.stringify(subscription));

    // For now, we mock success
    return {
        statusCode: 201,
        body: JSON.stringify({ message: "Subscribed successfully" })
    };
};
