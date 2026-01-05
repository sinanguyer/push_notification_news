
const { fetchAllNews } = require('../utils/news-fetcher.cjs');

exports.handler = async (event, context) => {
    try {
        const allNews = await fetchAllNews();

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // CORS
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(allNews)
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
