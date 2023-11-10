import Router from 'express';
import fetch from 'node-fetch';
import { mediaWikiUrlRoot, wordList } from '../constants/constants.js';
import { wordCollection } from '../server.js';

export const mediawikiRouter = Router();

mediawikiRouter.get('/startend', async (req, res) => {
    let start = Math.floor(Math.random() * wordList.length);
    let end = Math.floor(Math.random() * wordList.length);
    while(start === end) {
        end = Math.floor(Math.random() * wordList.length);
    } 

     // Store the pair in the database
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

mediawikiRouter.get('/page/:title', async (req, res) => {
    const apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${req.params['title']}&prop=text`;
    const data: string = await fetch(apiUrl)
        .then((response) => response.json())
        .then((data: any) => data && data.parse && data.parse.text ? data.parse.text['*'] : null);

    res.json({
        success: !!data,
        title: req.params['title'],
        html: data
    });
});