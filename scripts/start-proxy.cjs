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

// Mock Subscribe endpoint
app.post('/api/subscribe', express.json(), (req, res) => {
    console.log("Mock Subscribe:", req.body);
    res.status(201).json({ message: "Subscribed successfully" });
});

// Real-ish Test Notification (Uses web-push if keys valid)
const { handler: testHandler } = require('../netlify/functions/test-notification.cjs');

app.post('/api/test-notification', express.json(), async (req, res) => {
    console.log("Proxy: Delegating to test-notification.cjs");
    try {
        const result = await testHandler({
            httpMethod: 'POST',
            body: JSON.stringify(req.body)
        }, {});
        res.status(result.statusCode).send(result.body);
    } catch (e) {
        console.error("Proxy Error:", e);
        res.status(500).json({ error: e.message });
    }
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
