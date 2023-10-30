const express = require('express');

const port = 3000;
const app = express();

app.get('/', async (req, res) => {
    const data = 'data test';
    res.json({
        data: data,
        source: 'source test',
        size: data.length,
        desc: 'this is a test endpoint'
    });
});

app.listen(port, (error) => {
    !error
        ? console.log(`Running in port ${port}`)
        : console.log('Failed to start server.');
});