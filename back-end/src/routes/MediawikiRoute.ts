import Router from 'express';
import fetch from 'node-fetch';
import { ArticleEnhancerUtil } from '../util/ArticleEnhancerUtil.js';
import { JSDOM } from 'jsdom';
import { mediaWikiUrlRoot, wordList } from '../constants/constants.js';

export const mediawikiRouter = Router();

// GET endpoint that returns a random pair of words
mediawikiRouter.get('/startend', async (req, res) => {
    console.log('hit /startend');
    let start = Math.floor(Math.random() * wordList.length);
    let end = Math.floor(Math.random() * wordList.length);
    while(start === end) {
        end = Math.floor(Math.random() * wordList.length);
    } 

    res.json({
        start: wordList[start],
        end: wordList[end]
    });
});

// GET endpoint to return enhanced/cleaned article html
mediawikiRouter.get('/page/:title', async (req, res) => {
    console.log('hit /page/:title');
    let title: string = req.params['title']
    let apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;   
    let doc: Document = await getHtmlDoc(apiUrl);

    while(doc.querySelector('div[class="redirectMsg"]')) {
        title = String(doc.querySelector('a')?.getAttribute('title'));
        apiUrl = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;
        doc = await getHtmlDoc(apiUrl);
    }

    res.json({
        title: title,
        html: ArticleEnhancerUtil.cleanArticle(doc)
    });
});

async function getHtmlDoc(apiUrl: string): Promise<Document> {
    const data = await fetch(apiUrl)
        .then((response) => response.json())
        .then((data: any) => data && data.parse && data.parse.text ? data.parse.text['*'] : null);
    return (new JSDOM(data)).window.document
}