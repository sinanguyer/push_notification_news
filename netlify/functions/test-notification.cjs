
const webpush = require('web-push');

// Public/Private Keys (Same as Scheduler)
const publicVapidKey = 'BDZqfkh_jE2X2e-j-lzcJcZ9JY2dd1s0kTX-STetwNKlFcs8yo2k1poeYUPbGMi-PSkDo3mMnphzYho7i5zIhv8';
const privateVapidKey = 'KI8V_YKw-1hhRjTEWgi41ArX3wbQ1jeXEtltjiDHUOI';

webpush.setVapidDetails(
    'mailto:test@test.com',
    publicVapidKey,
    privateVapidKey
);

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const subscription = JSON.parse(event.body);

        const payload = JSON.stringify({
            title: 'Test Notification',
            body: 'Confirmation: Push alerts are working on your device!',
            url: '/'
        });

        await webpush.sendNotification(subscription, payload);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Test notification sent!" })
        };
    } catch (err) {
        console.error("Error sending test push:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
