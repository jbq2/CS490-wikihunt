<script lang="ts">
    import { mediaWikiService } from "../services/MediaWikiService";  
    import Timer from "./Timer.svelte";
    
    let pageContent: string = "";
    let currPage: string = ""; 
    let endPage: string | undefined = undefined; // has to be different than wikiPage initially
    let count: number = 0;
    let firstPage:string = "";
    let isWin = false;

    let timerComponent: Timer;

    function clickLink (event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)
        if (event.target.tagName === 'I') { // for the case where a wikipedia page uses italicized text
            const linkElm = event.target.closest('a');
            if (linkElm) {
               getPage(linkElm);
               count += 1;
            }   
        } else {
            if (event.target.tagName === 'A') { // check to see if it is a link with the <a> tag
                getPage(event.target);
                count += 1;
            }
        }

        if(currPage === endPage) { // just as an example
            timerComponent.stop();
            isWin = true;
        }
    }

 
    function fetchWikiPage() {
        // Figured out URL from here: https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=Project%3ASandbox&formatversion=2
        // on https://www.mediawiki.org/wiki/API:Parsing_wikitext and API sandbox
        mediaWikiService.getPagePromise(currPage)
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
        currPage = page.getAttribute('title')!
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
            currPage = String(doc.querySelector('a')?.getAttribute('title'));
        }

        return !!check;
    }

    function startGame(): void {
        mediaWikiService.getStartEndWords() 
            .then((startAndEnd) => { // gets array from service
                currPage = firstPage = startAndEnd[0]; // sets the start word
                endPage = startAndEnd[1];
                console.log(`START:"${currPage}", END: "${endPage}"`);
                timerComponent.startTimer();
                fetchWikiPage();
                isWin = false;
            })
            .catch((error) => {
                console.error("Error fetching Wikipedia pages:", error);
            });
    }

    function restartGame(): void {
        isWin = false;
        currPage = firstPage;
        timerComponent.restart();
        count = 0;
        fetchWikiPage();
        timerComponent.startTimer();
    }
</script>

<style>

    @import '/public/wiki-common.css';
    
    #win-message {
        font-size: 70px;
        margin-top: 6rem;
    }

    #win-caption {
        font-size: 35px;
        margin-top: 12rem;
    }

    #win-time {
        font-size: 35px;
        margin-top: 15rem;
    }

    #win-message, #win-caption, #win-time {
        text-align: center;
        width: 100%;
        position: fixed;
        z-index: 100; /* chose some random large number to put this message above every other element*/
    }

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

    #overlay-container {
    position: fixed;
    top: 10px; /* Adjust the top position as needed */
    right:0px; /* Adjust the left position as needed */
    height:100%;
    width:125px;
    background-color: rgba(255, 255, 255, 0.9); /* Semi-transparent background */
  
    padding: 5px;
    border-radius: 5px;
}
</style>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickLink}>
    {#if isWin}
        <h1 id="win-message">You Win!</h1>
        <h2 id="win-caption">You found "{ endPage }"</h2>
        <h2 id="win-time">in { timerComponent.getTime() }</h2>
    {/if}
    <input type="text" bind:value={ currPage } placeholder="Enter Wikipedia page title" />
    <button on:click={ fetchWikiPage }>Load Page</button>
    <button on:click={ startGame }>Start Game</button>
    <button on:click={ restartGame }>Restart Game</button>
    <div id= "overlay-container">
        <p id="click-counter"><b>  Wikipedia Articles Clicked: {count} </b></p> <!-- counter is at the bottom, not formated the best-->
        <p id="timer"><Timer bind:this={ timerComponent } /></p>
        <p> <b> Start Page: {firstPage} </b></p>

        <p> 
          <b> End Page: {endPage} </b> 
        </p>


    </div>
    
    
    <div 
        id="main-container"
        style="filter: blur({isWin ? '5px' : '0px'})"
    >
    
        <div id="wiki-page-container">
            {#if currPage}
                <h1>{ currPage }</h1>
            {/if}
            {@html pageContent} <!-- loads content -->
        </div>
    </div>
</main>
