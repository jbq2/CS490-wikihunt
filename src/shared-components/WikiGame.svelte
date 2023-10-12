<script setup lang="ts">
    import { mediaWikiService } from "../services/MediaWikiService";  
    import Timer from "./Timer.svelte";
    
    let pageContent: string = "";
    let wikiPage: string = ""; 
    let count: number = 0;

    let timerComponent: Timer;

    function clickLink (event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)
        console.log(event.origin);
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

        if(wikiPage == 'Cooking apple') { // just as an example
            timerComponent.stop();
        }
    }

    function fetchWikiPage() {
        // Figured out URL from here: https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=Project%3ASandbox&formatversion=2
        // on https://www.mediawiki.org/wiki/API:Parsing_wikitext and API sandbox
        mediaWikiService.getPagePromise(wikiPage)
            .then((data) => { // get data
                if (data && data.parse && data.parse.text) { // gets all data, parsed data, and parsed text
                    pageContent = cleanPage(data.parse.text["*"]);
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
        console.log("Next Page:", wikiPage); // sets wikiPage to be the next page based on link name
        fetchWikiPage(); // show new page
    }

    function cleanPage(pageContent: string){
        let parser = new DOMParser();
        let doc = parser.parseFromString(pageContent, 'text/html');

        let editLinks = doc.querySelectorAll("span.mw-editsection");
        for (let link of editLinks){
            link.remove();
        }

        let headerBox = doc.querySelector("table[class^='box-']");
        if (headerBox) {
            headerBox.remove();
        }

        return doc.body.innerHTML;
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
    <Timer bind:this={ timerComponent } />
    
    <div id="wiki-page-container">
        {@html pageContent} <!-- loads content -->
    </div>
</main>
