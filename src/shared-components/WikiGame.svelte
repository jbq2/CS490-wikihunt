<script lang="ts">
    import { mediaWikiService } from "../services/MediaWikiService";  

    let pageContent:string = "";
    let wikiPage:string = ""; 
    let count = 0;
    import Timer from "./Timer.svelte";

    function clickLink (event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)
        if (event.target.tagName === 'I') { // for the case where a wikipedia page uses italicized text
            const linkElm = event.target.closest('a');
            if (linkElm) {
               getPage(linkElm);
               count+=1;
            }   
        } else {
            if (event.target.tagName === 'A') { // check to see if it is a link with the <a> tag
                getPage(event.target);
                count+=1
            }
        }
    }

    function fetchWikiPage() {
        // Figured out URL from here: https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=Project%3ASandbox&formatversion=2
        // on https://www.mediawiki.org/wiki/API:Parsing_wikitext and API sandbox
        mediaWikiService.getPagePromise(wikiPage)
            .then((data) => { // get data
                if (data && data.parse && data.parse.text) { // gets all data, parsed data, and parsed text
                    let tempData = cleanPage(data.parse.text["*"]);
                    if (isRedirectPage(tempData)){  
                        fetchWikiPage();
                    }
                    else{
                        pageContent = tempData;
                    }

                }
            })
            .catch((error) => { // errors
                console.error("Error fetching Wikipedia content:", error);
            });
        window.scrollTo({ // resets the page to view the top
            top: 0,
            behavior: 'auto'
        });
    }

    function getPage(page: HTMLAnchorElement) {
        wikiPage = page.getAttribute('title')!
        fetchWikiPage(); // show new page
    }

    function eraseElements(elements: NodeListOf<Element>): void {
        for(let e of elements) {
            e.remove()
        }
    }

    function cleanPage(pageContent: string){
        const parser: DOMParser = new DOMParser();
        const doc: Document = parser.parseFromString(pageContent, 'text/html');

        eraseElements(doc.querySelectorAll("span.mw-editsection"));
        eraseElements(doc.querySelectorAll("table[class^='box-']"));
        eraseElements(doc.querySelectorAll("sup[id^='cite_ref'], sup[class='noprint Inline-Template Template-Fact']"));
        eraseElements(doc.querySelectorAll("span[id='References'], span[id='Notes'], span[id='Citations'], span[id='Bibliography'], span[id='Further_reading']"))
        eraseElements(doc.querySelectorAll("div[class^='reflist'], div[class='refbegin']"));
        eraseElements(doc.querySelectorAll("sup[class^='noprint']"))

        const otherCitations: NodeListOf<Element> = doc.querySelectorAll("sup");
        for (let otherCitation of otherCitations){
            if (otherCitation.textContent?.trim() === "[citation needed]")
                otherCitation.remove();
        }

        return doc.body.innerHTML;
    }

    function isRedirectPage(pageContent: string): boolean {
        const parser = new DOMParser();
        const doc = parser.parseFromString(pageContent, 'text/html');

        const check = doc.querySelector('div[class="redirectMsg"]');
        if (check){
            wikiPage = String(doc.querySelector('a')?.getAttribute('title'));
        }

        return check ? true : false;
    }
</script>

<style>

    @import '/public/wiki-common.css';

    #wiki-page-container {
        align-items: center;
        justify-items: center;
        padding-left: 12.5%;
        padding-right: 12.5%;
        width: 75%;

        grid-template-columns: repeat(2, 50fr);
        grid-column-gap: 1px; /* Adjust the gap as needed */
    }

    #wiki-page-container :global(table.wikitable), :global(figure), :global(li.gallerybox) {
        background-color: #f8f9fa;
        border: 1px solid #a2a9b1;     
        padding: 5px;  
    }
    #wiki-page-container :global(li.gallerybox) {
        margin: 3px;
        display: inline-block;
    }

    #wiki-page-container :global(table.wikitable) {
        background-color: #f8f9fa;
        border: 1px solid #a2a9b1;
    }

    #wiki-page-container :global(figure) {
        padding:5px;
        text-align: center;
        float: right;
        margin: 1rem;
    }

    #wiki-page-container :global(p) {
        clear: left;
    }

    #wiki-page-container :global(figcaption) {
        width:20rem
    }
</style>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickLink}>
    <input type="text" bind:value={wikiPage} placeholder="Enter Wikipedia page title" />
    <button on:click={fetchWikiPage}>Load Page</button>

    <p> Wikipedia Articles Clicked: {count}</p> <!-- counter is at the bottom, not formated the best-->
    <Timer />
    
    <div id="wiki-page-container">
        {@html pageContent} <!-- loads content -->
    </div>
</main>
