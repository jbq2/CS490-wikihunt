import Router from 'express';
import { wordList } from '../constants/constants.js';
import { wordCollection } from '../server.js';
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

mediawikiRouter.post('/startend', async (req, res) => {
    let start = Math.floor(Math.random() * wordList.length);
    let end = Math.floor(Math.random() * wordList.length);
    while(start === end) {
        end = Math.floor(Math.random() * wordList.length);
    } 
    try {
        await wordCollection.insertOne({
            start: wordList[start],
            end: wordList[end]
        });
        res.json({
            start: wordList[start],
            end: wordList[end],
        });
    } catch (error) {
        console.error('Failed to store the pair in the database:', error);
        res.status(500).json({ error: 'Failed to store the pair in the database' });
    }
});

