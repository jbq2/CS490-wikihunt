export class ArticleEnhancerUtil { 
    private constructor() { } // utility class

    public static cleanArticle(doc: Document): string {
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("span.mw-editsection"));
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("table[class^='box-']"));
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("sup[id^='cite_ref'], sup[class='noprint Inline-Template Template-Fact']"));
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("span[id='References'], span[id='Notes'], span[id='Citations'], span[id='Bibliography'], span[id='Further_reading']"))
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("div[class^='reflist'], div[class='refbegin']"));
        ArticleEnhancerUtil.eraseElements(doc.querySelectorAll("sup[class^='noprint']"))

        const otherCitations: NodeListOf<Element> = doc.querySelectorAll("sup");
        for (let otherCitation of otherCitations){
            if (otherCitation.textContent?.trim() === "[citation needed]")
                otherCitation.remove();
        }

        return doc.body.innerHTML;
    }

    private static eraseElements(elements: NodeListOf<Element>): void {
        for(let e of elements) {
            e.remove()
        }
    }
}