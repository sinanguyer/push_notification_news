
const webpush = require('web-push');

// Public/Private Keys (Cleaned to ensure Standard Base64 for web-push/atob compatibility)
// Original: BPmFvLBRVcLMLlu-6WLczxUbIDZ-FCD-HU4RVwD24gEzDNU225LlcLQjIHlgMEvc_mseZEZjltC5IkvxGb_0oI0
// Original Private: 9-yySpkz7HrEI_uCDaxpz2KnTBcI1dqlsZ4mAHYMDDs

const cleanPublic = 'BPmFvLBRVcLMLlu-6WLczxUbIDZ-FCD-HU4RVwD24gEzDNU225LlcLQjIHlgMEvc_mseZEZjltC5IkvxGb_0oI0'
    .replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (4 - 'BPmFvLBRVcLMLlu-6WLczxUbIDZ-FCD-HU4RVwD24gEzDNU225LlcLQjIHlgMEvc_mseZEZjltC5IkvxGb_0oI0'.length % 4) % 4);

const cleanPrivate = '9-yySpkz7HrEI_uCDaxpz2KnTBcI1dqlsZ4mAHYMDDs'
    .replace(/-/g, '+').replace(/_/g, '/') + '=='.substring(0, (4 - '9-yySpkz7HrEI_uCDaxpz2KnTBcI1dqlsZ4mAHYMDDs'.length % 4) % 4);

webpush.setVapidDetails(
    'mailto:test@test.com',
    cleanPublic,
    cleanPrivate
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
