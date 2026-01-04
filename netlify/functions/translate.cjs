const translate = require('google-translate-api-x');

exports.handler = async (event, context) => {
    try {
        const { text, targetLang } = JSON.parse(event.body);

        if (!text || !targetLang) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing text or targetLang' })
            };
        }

        const res = await translate(text, { to: targetLang });

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ translatedText: res.text })
        };
    } catch (err) {
        console.error("Translation Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
