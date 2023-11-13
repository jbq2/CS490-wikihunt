import express from 'express';
import { mediawikiRouter } from './routes/MediawikiRoute.js';
import { daily } from './functions/daily.js'

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

app.use('/mediawiki', mediawikiRouter);

try {
    app.listen(port, () => {
        console.log(`running server on port ${port}`);
    });
}
catch(e) {
    console.log('failed to start server');
}

setInterval(daily.checkTime, 60000); // 60,000 milliseconds = 1 minute