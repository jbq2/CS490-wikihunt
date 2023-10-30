import Router from 'express';
import { wordList } from '../constants/constants.js';

export const mediawikiRouter = Router();

mediawikiRouter.get('/startend', async (req, res) => {
    let start = Math.floor(Math.random() * wordList.length);
    let end = Math.floor(Math.random() * wordList.length);
    while(start === end) {
        end = Math.floor(Math.random() * wordList.length);
    } 
    res.json({
        start: wordList[start],
        end: wordList[end],
    });
});

