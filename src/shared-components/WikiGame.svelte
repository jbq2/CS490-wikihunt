<script setup lang="ts">
    import { wikiHtmlStyles } from "../constants/wiki-html-css";

    // import { onMount } from "svelte"; // onMount runs after the component is first rendered to the DOM.
    let wikiPage = ""; // Wiki Page to be Displayed
    let pageContent = "";

    function fetchWikiPage() {
        // Figured out URL from here: https://www.mediawiki.org/w/api.php?action=parse&format=json&origin=*&page=Project%3ASandbox&formatversion=2
        // on https://www.mediawiki.org/wiki/API:Parsing_wikitext and API sandbox
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${wikiPage}&prop=text`;
  
        fetch(apiUrl)
            .then((response) => {
                return response.json();
            }) 
            .then((data) => { // get data
                if (data && data.parse && data.parse.text) { // gets all data, parsed data, and parsed text
                    pageContent = wikiHtmlStyles + data.parse.text["*"];
                    console.log(pageContent);
                }
            })
            .catch((error) => { // error
                console.error("Error fetching Wikipedia content:", error);
            });
        window.scrollTo({ // resets the page to view the top
            top: 0,
            behavior: 'auto'
        });
    }

    function clickLink(event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)
        if (event.target.tagName === 'I') { // for the case where a wikipedia page uses italicized text
            const linkElm: HTMLAnchorElement = event.target.closest('a');
            if (linkElm) {
                getPage(linkElm);
            }
        } else {
            if (event.target.tagName === 'A') { // check to see if it is a link with the <a> tag
                getPage(event.target);
            }
        }
    }

    function getPage(page: HTMLAnchorElement) {
        wikiPage = page.getAttribute('title')!;
        console.log("Next Page:", wikiPage); // sets wikiPage to be the next page based on link name
        fetchWikiPage(); // show new page
    }
</script>

<style>
    #wiki-page-container {
        width:50rem;
        margin: auto;
    }

    /* https://stackoverflow.com/questions/56607606/styling-a-html-tag-of-a-svelte-component-by-ising-the-in-component-style */
        /* use of :global in css to style injected html using @html */
    /* #wiki-page-container :global(tr) {
        margin: auto;
        display: inline-block;
    } */
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickLink}>
    <input type="text" bind:value={wikiPage} placeholder="Enter Wikipedia page title" />
    <button on:click={fetchWikiPage}>Load Page</button>
    <div id="wiki-page-container">
        {@html pageContent} <!-- loads content -->
    </div>
</main>
