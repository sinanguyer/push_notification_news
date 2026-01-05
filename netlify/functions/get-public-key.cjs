
const { publicKey } = require('./vapid-config.cjs');

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ key: publicKey }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    };
};
