
const webpush = require('web-push');

// Public/Private Keys (Same as Scheduler)
const publicVapidKey = 'BLwgy8VcZILQhZObCHC4Fa21bfF3K_oIiRek1o5JiJwNJG3Bzoii0ky8DcON7ugKOoChSgJaXnGPLgoJlPtu-lw';
const privateVapidKey = 'ZhUlZ84G3zu4k6BOaN9P0GA_bUq_IFVhej8Ahuui13A';

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
