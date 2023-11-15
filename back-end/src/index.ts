import express from 'express';
import cors from 'cors';
import { mediawikiRouter } from './routes/MediawikiRoute.js';
// import { daily } from './DAO/daily.js'

const port = 3000;
const app = express();

const corsOptions = {
    origin: '*' // this should be changed to actual name of front end url in production
};

app.use(cors(corsOptions));
app.get('/', async (req, res) => {
    const data = 'test data';
    res.json({
        data: data,
        source: 'test source',
        size: data.length,
        desc: 'test endpoint'
    });
    // setInterval(() => daily.checkTime(), 60000); // 60,000 milliseconds = 1 minute 
    // setInterval(() => daily.getDailyWords(), 60000); // 60,000 milliseconds = 1 minute 
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
