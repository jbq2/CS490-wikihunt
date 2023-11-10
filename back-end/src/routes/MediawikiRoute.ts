import Router from 'express';
import fetch from 'node-fetch';
import { HtmlCleanerUtil } from '../util/HtmlCleanerUtil.js';
import { JSDOM } from 'jsdom';
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
    let title: string = req.params['title']
    let apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;
    let data: string = await fetch(apiUrl)
        .then((response) => response.json())
        .then((data: any) => data && data.parse && data.parse.text ? data.parse.text['*'] : null);    
    let doc: Document = (new JSDOM(data)).window.document;

    while(getRedirectMsg(doc)) {
        title = String(doc.querySelector('a')?.getAttribute('title'));
        apiUrl = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;
        data = await fetch(apiUrl)
            .then((response) => response.json())
            .then((data: any) => data && data.parse && data.parse.text ? data.parse.text['*'] : null);
        doc = (new JSDOM(data)).window.document;
    }

    res.json({
        success: !!data,
        title: title,
        html: HtmlCleanerUtil.cleanHtml(doc)
    });
});

function getRedirectMsg(doc: Document): Element {
    const check = doc.querySelector('div[class="redirectMsg"]');
    return check;
}