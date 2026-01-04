// Polyfill for pdf-parse which requires DOMMatrix
if (typeof DOMMatrix === 'undefined') {
    global.DOMMatrix = class DOMMatrix { };
}

const fetch = require('node-fetch');
const cheerio = require('cheerio');
const pdf = require('pdf-parse');

exports.handler = async (event, context) => {
    try {
        const { url } = event.queryStringParameters || {};

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing url parameter' })
            };
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let content = '';

        if (contentType && contentType.includes('application/pdf')) {
            const buffer = await response.buffer();
            const data = await pdf(buffer);
            content = data.text;
            // Basic cleanup of PDF text
            content = content.replace(/\n\s*\n/g, '\n').substring(0, 5000); // Limit length
        } else {
            const html = await response.text();
            const $ = cheerio.load(html);

            // Try common article selectors
            const selectors = [
                'article',
                '.content-main',
                '.news-content',
                '.pressemitteilung',
                'main',
                '#content',
                'body'
            ];

            for (const selector of selectors) {
                if ($(selector).length > 0) {
                    // Remove scripts and styles
                    $(selector).find('script, style, nav, footer, header').remove();
                    content = $(selector).text().trim();
                    if (content.length > 200) break; // Good enough
                }
            }

            // Cleanup whitespace
            content = content.replace(/\s+/g, ' ').trim();
            if (content.length > 5000) content = content.substring(0, 5000) + '...';
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        };

    } catch (err) {
        console.error("Content Fetch Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        };
    }
};
