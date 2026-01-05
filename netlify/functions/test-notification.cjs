
const webpush = require('web-push');

const webpush = require('web-push');
const { publicKey, privateKey, subject } = require('./vapid-config.cjs');

webpush.setVapidDetails(subject, publicKey, privateKey);

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
            body: JSON.stringify({
                error: err.message,
                details: {
                    statusCode: err.statusCode,
                    body: err.body,
                    headers: err.headers
                }
            })
        };
    }
};
