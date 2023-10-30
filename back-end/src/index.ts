import express from 'express';

const port = 3000;
const app = express();

app.get('/', async (req, res) => {
    const data = 'test data';
    res.json({
        data: data,
        source: 'test source',
        size: data.length,
        desc: 'test endpoint'
    }); 
});

try {
    app.listen(port, () => {
        console.log(`running server on port ${port}`);
    });
}
catch(e) {
    console.log('failed to start server');
}