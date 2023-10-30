<script lang="ts">
    import { mediaWikiService } from "../services/MediaWikiService";  
    import { wordList } from "../constants/constants";
    import { tick } from 'svelte';
    import Timer from "./Timer.svelte";
    
    let pageContent: string = "";
    let currPage: string = ""; 
    let endPage: string | undefined = undefined; // has to be different than wikiPage initially
    let count: number = 0;
    let firstPage:string = "";
    let isWin = false;
    let startCheck:boolean = false;
    let path:string[] = [];

    let timerComponent: Timer;

    function clickLink (event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)

        if (event.target.getAttribute("class") === "external text") { return };

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
            path.pop();
            path.push(endPage);
            timerComponent.stop();
            isWin = true;
        }
    }

 
    function fetchWikiPage() {
        // Figured out URL from here: https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=Project%3ASandbox&formatversion=2
        // on https://www.mediawiki.org/wiki/API:Parsing_wikitext and API sandbox
        console.log(currPage);
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
        console.log("Navigating to Page: ", currPage);
        fetchWikiPage(); // show new page
        path.push(currPage);
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
            if (currPage == endPage){
                isWin = true;
            }
        }

        return !!check;
    }

    function getIdx(length: number) { // Gets two random indexes
        let max = length;
        let startIdx = Math.floor(Math.random() * max);
        let endIdx = Math.floor(Math.random() * max);
        while (startIdx == endIdx) { // Make sure they are not the same
            startIdx = Math.floor(Math.random() * length);
            endIdx = Math.floor(Math.random() * length);
        }
        return [startIdx, endIdx];
    }

    async function getTopWords(): Promise<void> { // Gets the array of the mostviewed pages up to max 
        let max = 100; // Change this number to set how many top Wikipedia pages to get
        let idxs = getIdx(max+1);
        let startIdx = idxs[0] + 1;
        let endIdx = idxs[1] + 1;
        let words: string[] = [];
        try {
            let wordsFromOffset = await mediaWikiService.getNextSetOfWords(startIdx); 
            words.push(...wordsFromOffset); 
            wordsFromOffset = await mediaWikiService.getNextSetOfWords(endIdx); 
            words.push(...wordsFromOffset); 

            currPage = firstPage = words[0]; 
            endPage = words[1];
            if (currPage === undefined || endPage === undefined) { // If words were unable to be obtained
                getRandomWords();
            } else {
                console.log(`START:"${currPage}" IDX: "${startIdx}", END: "${endPage}", IDX: "${endIdx}"`);
                timerComponent.startTimer();
                fetchWikiPage();
            }
        } catch (error) {
            console.error("Error fetching list of pages:", error);
        }
    }
    
    async function getRandomWords(): Promise<void> { // Uses random words for the game
        try {
            const words = await mediaWikiService.getRandomWords();
            currPage = firstPage = words[0]; // sets the start word
            path.push(currPage);
            endPage = words[1];
            console.log(`START:"${currPage}", END: "${endPage}"`);
            timerComponent.startTimer();
            fetchWikiPage();
        } catch (error) {
            console.error("Error fetching Wikipedia pages:", error);
        }
    }

    async function getSetWords(): Promise<void> {
        const idxs = getIdx(wordList.length);
        const startIdx = idxs[0];
        const endIdx = idxs[1]
        currPage = firstPage = wordList[startIdx]; 
        path.push(firstPage);
        endPage = wordList[endIdx];
        // endPage = "Apple";
        // endPage = "Christmas";
        console.log(`START:"${currPage}" IDX: "${startIdx}", END: "${endPage}", IDX: "${endIdx}"`);
        await tick(); // Allows timer to load
        timerComponent.startTimer();
        fetchWikiPage();
    }

    function start(): void {
        startCheck = true;
        // getTopWords(); // Gets two random wikipedia pages that are in most viewed
        // getRandomWords(); // Gets two fully random wikipedia pages
        getSetWords(); // Get words from the set list
    }

    function restartGame(): void {
        isWin = false;
        currPage = firstPage;
        timerComponent.restart();
        count = 0;
        path = [];
        fetchWikiPage();
        timerComponent.startTimer();
    }

    function newGame(): void {
        isWin = false;
        count = 0;
        timerComponent.restart();
        path = [];
        start();
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

    #win-clicks {
        font-size: 30px;
        margin-top: 18rem;
    }

    #path-and-new-game-button-container {
        font-size: 20px;
        margin-top: 21rem;
        text-align: center;
        position: fixed;
        width: 75%;
        left: 12.5%; /* (100% - 75%) / 2 to center the element */
        z-index: 100; /* chose some random large number to put this message above every other element*/
    }

    #win-message, #win-caption, #win-time, #win-clicks {
        text-align: center;
        position: fixed;
        width: 100%;
        z-index: 100; /* chose some random large number to put this message above every other element*/
    }

    #wiki-page-container {
        align-items: center;
        justify-items: center;
        padding-left: 12.5%;
        padding-right: 12.5%;
        width: 75%;
        position: relative;
        grid-template-columns: repeat(2, 50fr);
        grid-column-gap: 1px; /* Adjust the gap as needed */
        margin-right: 125px; /* Add margin to account for the overlay container width */
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
        text-align: center;
        top: 10px;
        right:0px;
        height:100%;
        width:125px; 
        padding: 5px 5px 5px 5px;
        z-index: 50;
    }
</style>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickLink}>
    {#if !startCheck}
        <button id="start-button" on:click={ start }>Start Game</button>
    {:else}         
        {#if isWin}
            <h1 id="win-message">You Win!</h1>
            <h2 id="win-caption">You found "{ endPage }"</h2>
            <h2 id="win-time">in { timerComponent.getTime() }</h2>
            <h3 id='win-clicks'>Final Score: { count } clicks</h3>
            <div id='path-and-new-game-button-container'>
                <strong>Path:</strong>
                {#each path as page}
                    {' '+page+' '}
                    {#if page !== path[count]} 
                        →
                    {/if} 
                {/each}
                <h3 id='new-game-button-container'>
                    <button id='new-game-button' on:click={ newGame }>New Game</button>
                </h3>
            </div>
        {/if}
        <!-- <input type="text" bind:value={ currPage } placeholder="Enter Wikipedia page title" /> -->
        <!-- <button on:click={ fetchWikiPage }>Load Page</button> -->
        <div 
            id= "overlay-container"
            style="filter: blur({isWin ? '5px' : '0px'})"    
        >
            <p id="click-counter"><b>  Wikipedia Articles Clicked: {count} </b></p> <!-- counter is at the bottom, not formated the best-->
            <p id="timer"><Timer bind:this={ timerComponent } /></p>
            <p> <b> Start Page: {firstPage} </b></p>
            <p> 
            <b> End Page: {endPage} </b> 
            </p>
            <button id='restart-button' on:click={ restartGame }>Restart Game</button>
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
    {/if}
</main>
