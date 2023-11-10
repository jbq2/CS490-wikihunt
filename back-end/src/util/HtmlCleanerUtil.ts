export class HtmlCleanerUtil { 
    private constructor() { } // utility class

    public static cleanHtml(doc: Document): string {
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("span.mw-editsection"));
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("table[class^='box-']"));
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("sup[id^='cite_ref'], sup[class='noprint Inline-Template Template-Fact']"));
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("span[id='References'], span[id='Notes'], span[id='Citations'], span[id='Bibliography'], span[id='Further_reading']"))
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("div[class^='reflist'], div[class='refbegin']"));
        HtmlCleanerUtil.eraseElements(doc.querySelectorAll("sup[class^='noprint']"))

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