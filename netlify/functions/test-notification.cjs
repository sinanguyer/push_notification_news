const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:sinan@bavarianews.app',
    'BFdE0U_Os0l3nRfYIOJtVl76V0B9sBSKKXTzfMcDEvfa06tL_w05jIJNCIbizsl6xOjS70VMP5Tpl-qw8l-06aA',
    'ZMWyOS9phIv1EZ_7jffPb-5V7B4uU_fRI_nAXSu8Uo0'
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
