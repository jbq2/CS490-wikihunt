import Router from 'express';
import { wordCollection } from '../server.js';
import { daily } from '../DAO/daily.js'
import fetch from 'node-fetch';
import { ArticleEnhancerUtil } from '../util/ArticleEnhancerUtil.js';
import { JSDOM } from 'jsdom';
import { mediaWikiUrlRoot, wordList } from '../constants/constants.js';
import { ArticleContent } from '../constants/models.js';
export const mediawikiRouter = Router();

// GET endpoint that returns a random pair of words
mediawikiRouter.get('/randomwords', async (req, res) => {
    let words = await daily.getRandomTwoWords();
    let endTitle: string = words[1];
    let apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${endTitle}&prop=text`;
    let temp: ArticleContent = await getArticleContent(apiUrl, endTitle);
    endTitle = temp.title;
    res.json({
        start: words[0],
        end: endTitle
    });
});

mediawikiRouter.get('/dailywords', async (req, res) => {
    let words = await daily.getDailyWords();
    let endTitle: string = words[1];
    let apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${endTitle}&prop=text`;
    let temp: ArticleContent = await getArticleContent(apiUrl, endTitle);
    endTitle = temp.title;

    res.json({
        start: words[0],
        end: endTitle
    });
});

// GET endpoint to return enhanced/cleaned article html
mediawikiRouter.get('/page/:title', async (req, res) => {
    let title: string = req.params['title']
    const apiUrl: string = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;   
    const temp: ArticleContent = await getArticleContent(apiUrl, title);

    title = temp.title;
    const html: string = ArticleEnhancerUtil.cleanArticle(temp.doc);

    res.json({
        title: title,
        html: html
    });
});

async function getArticleContent(apiUrl: string, queryTitle: string): Promise<ArticleContent> {
    let doc: Document = await fetchHtmlDoc(apiUrl);
    let title: string = queryTitle;
    while(doc.querySelector('div[class="redirectMsg"]')) {
        title = String(doc.querySelector('a')?.getAttribute('title'));
        apiUrl = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${title}&prop=text`;
        doc = await fetchHtmlDoc(apiUrl);
    }

    return <ArticleContent>{
        title: title,
        doc: doc
    };
}

async function fetchHtmlDoc(queryTitle: string): Promise<Document> {
    const apiUrl = `${mediaWikiUrlRoot}?action=parse&format=json&origin=*&page=${queryTitle}&prop=text`;
    const data = await fetch(apiUrl)
        .then((response) => response.json())
        .then((data: any) => data && data.parse && data.parse.text ? data.parse.text['*'] : null);
    return (new JSDOM(data)).window.document;
}