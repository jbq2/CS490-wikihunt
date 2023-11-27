export class ArticleEnhancerUtil { 
    private constructor() { } // utility class

    public static cleanArticle(doc: Document): string {
        this.eraseElements(doc.querySelectorAll("span.mw-editsection"));
        this.eraseElements(doc.querySelectorAll("table[class^='box-']"));
        this.eraseElements(doc.querySelectorAll("sup[id^='cite_ref'], sup[class='noprint Inline-Template Template-Fact']"));
        this.eraseElements(doc.querySelectorAll("span[id='References'], span[id='Notes'], span[id='Citations'], span[id='Bibliography'], span[id='Further_reading']"))
        this.eraseElements(doc.querySelectorAll("div[class^='reflist'], div[class='refbegin']"));
        this.eraseElements(doc.querySelectorAll("sup[class^='noprint']"))

        this.formatMulticolTables(doc);

        const otherCitations: NodeListOf<Element> = doc.querySelectorAll("sup");
        for (let otherCitation of otherCitations){
            if (otherCitation.textContent?.trim() === "[citation needed]")
                otherCitation.remove();
        }

        return doc.body.innerHTML;
    }

    private static formatMulticolTables(doc: Document): void {
        const multicolTables: Element[] = Array.from(doc.querySelectorAll('.multicol'))
            .map((mt) => mt.parentElement);

        for(let mt of multicolTables) {
            mt.setAttribute('style', 'overflow-x: scroll; text-align: left; align-items: center;');
        }
    }

    private static eraseElements(elements: NodeListOf<Element>): void {
        for(let e of elements) {
            e.remove()
        }
    }
}