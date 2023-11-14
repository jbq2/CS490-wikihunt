import Router from 'express';
import { wordList } from '../constants/constants.js';
import { wordCollection } from '../server.js';
import { daily } from '../DAO/daily.js'
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

mediawikiRouter.get('/getwords', async (req, res) => {
    let words = await daily.getDailyWords()
    res.json({
        start: words[0],
        end: words[1],
    });
});

