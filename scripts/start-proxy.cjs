const express = require('express');
const cors = require('cors');
const { handler } = require('../netlify/functions/fetch-rss.cjs');

const app = express();
const PORT = 3001;

app.use(cors());

// Mimic Netlify Function signature for News
app.get('/api/news', async (req, res) => {
    const event = {
        httpMethod: 'GET',
        queryStringParameters: req.query,
    };

    const result = await handler(event, {});

    // Apply headers from function result
    if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
    }

    res.status(result.statusCode).send(result.body);
});

// Mimic Netlify Function signature for Translation
const { handler: translateHandler } = require('../netlify/functions/translate.cjs');

app.post('/api/translate', express.json(), async (req, res) => {
    const event = {
        httpMethod: 'POST',
        body: JSON.stringify(req.body),
    };

    const result = await translateHandler(event, {});

    if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
    }

    res.status(result.statusCode).send(result.body);
});

// Mimic Netlify Function for Content Fetching
const { handler: contentHandler } = require('../netlify/functions/fetch-content.cjs');

app.get('/api/fetch-content', async (req, res) => {
    const event = {
        httpMethod: 'GET',
        queryStringParameters: req.query,
    };

    const result = await contentHandler(event, {});

    if (result.headers) {
        Object.entries(result.headers).forEach(([key, value]) => {
            res.setHeader(key, value);
        });
    }

    res.status(result.statusCode).send(result.body);
});


app.listen(PORT, () => {
    console.log(`Proxy server running at http://localhost:${PORT}`);
});
