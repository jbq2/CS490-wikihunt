<nav>
    <ul>
        <li>
            <a href="/">Home</a>
        </li>
        <li>
            <a href="/wiki">Wiki</a>
        </li>
        <li>
            <a href="/leaderboard">Leaderboard</a>
        </li>
    </ul>
</nav>

<script setup lang="ts">
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
                    pageContent = data.parse.text["*"];
                }
            })
            .catch((error) => { // error
                console.error("Error fetching Wikipedia content:", error);
            });
    }

    function clickLink(event) {
        event.preventDefault(); // prevents default (navigate to a new page)
        if (event.target.tagName === 'A') { // check to see if it is a link with the a tag
            wikiPage = event.target.textContent; // sets wikiPage to be the next page based on link name
            console.log("Next Page:", wikiPage);
            fetchWikiPage(); // show new page
        }
    }
</script>

<main on:click={clickLink}>
    <input type="text" bind:value={wikiPage} placeholder="Enter Wikipedia page title" />
    <button on:click={fetchWikiPage}>Load Page</button>
    {@html pageContent} <!-- loads content -->
</main>

<style>
    @import '/public/global.css';
</style>