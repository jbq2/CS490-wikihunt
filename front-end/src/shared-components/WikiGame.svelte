<script lang="ts">
    // import { _ } from "$env/static/private";
    import { writeToCookie } from '../lib/CookieHelper';
    import { onMount } from "svelte";
    import type { PageApiResponse, StartEndApiResponse, FinalTime, DateFormat, Stats, GameCount, CookieCollection } from "../constants/models";
    import { mediaWikiService } from "../services/MediaWikiService";  
    import Timer from "./Timer.svelte";
    
    const date: Date = new Date();
    const today:DateFormat = {
        'month': date.getMonth()+1,
        'day': date.getDate(),
        'year': date.getFullYear()
    }

    let pageContent: string = "";
    let currPage: string = ""; 
    let endPage: string | undefined = undefined; // has to be different than wikiPage initially
    let count: number = 0;
    let firstPage:string = "";
    let isWin = false;
    let startCheck:boolean = false;
    let path:string[] = [];
    let pathString:string = "";
    let isLoading = false;
    let elapsedTime: FinalTime;
    export let origEnd: string | undefined = undefined; // has to be different than wikiPage initially
    export let origStart:string = "";

    let timerComponent: Timer;


    function getGameStats(): Stats {
        let wordPair: object = {
            'start': firstPage,
            'end': endPage
        };  

        return {
            'date':today,
            'goal': wordPair,
            'playTime': elapsedTime,
            'clicks':count,
            'winPath': path
        };
    }

    function clickLink (event: any) {
        event.preventDefault(); // prevents default (navigate to a new page)

        if (event.target.tagName === 'I') { // for the case where a wikipedia page uses italicized text
            const linkElm = event.target.closest('a');
            if (linkElm) {
               getPage(linkElm);
            }   
        } else {
            if (event.target.tagName === 'A') { // check to see if it is a link with the <a> tag
                getPage(event.target);
            }
        }
    }

    function fetchWikiPage(): void {
        isLoading = true;
        mediaWikiService.getPageFromApi(currPage)
            .then((data: PageApiResponse) => {
                pageContent = data.html;
                isLoading = false;
            });
        window.scrollTo({ // resets the page to view the top
            top: 0,
            behavior: 'auto'
        });
    }

    function getPage(page: HTMLAnchorElement) {
        let temp:string = page.getAttribute('title')!
        if (!temp)
            return;
        
        path.push(temp);
        currPage = temp;
        count++;

        if (temp == endPage){
            pathString += endPage;
            timerComponent.stop();
            isWin = true;
            elapsedTime = timerComponent.getTime();
            writeToCookie(getGameStats());
        } else 
            pathString += temp + ' → ';

        
        console.log("Navigating to Page: ", currPage);
        fetchWikiPage(); // show new page
    }

    function start(): void {
        startCheck = true;
        currPage = firstPage = origStart;
        endPage = origEnd;
        timerComponent.startTimer();
        fetchWikiPage();
        path.push(currPage);
        pathString += currPage + ' → ';
        console.log(`START:"${currPage}", END: "${endPage}"`);
    }

    function restartGame(): void {
        clearGame();
        currPage = firstPage;
        timerComponent.restart();
        fetchWikiPage();
        timerComponent.startTimer();
    }

    function newGame(): void {
        clearGame();
        timerComponent.restart();
        start();
        fetchWikiPage();
    }

    function clearGame(): void {
        isWin = false;
        count = 0;
        path = [];
        pathString = "";
    }
    
    function openStats() {
        let statsBar = document.getElementById("overlay-container");

        if (statsBar) {
            statsBar.style.width = "125px";
            statsBar.style.right = "0";
        }
    }

    function closeStats() {
        let statsBar = document.getElementById("overlay-container");

        if (statsBar) {
            statsBar.style.width = "0";
            statsBar.style.right = "-5%";
        }
    }
    
    onMount(() => {
        start();
    });
</script>

<style>
    @import '/public/wiki-common.css';
    @import url('https://fonts.googleapis.com/css?family=Varela Round');
    
    #win-container {
        position: fixed;
        width: 75%;
        left: 12.5%; 
        z-index: 100; 
        text-align: center;
        overflow: hidden; 
        margin-top: 5%;
        font-family: 'Varela Round';
        border: 2px solid #5aa8a8; 
        border-radius: 10px; 
    }

    #win-container::before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(237, 246, 247, 0.75); 
        z-index: -1;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    #win-message,
    #win-caption,
    #win-time,
    #win-clicks,
    #path-and-new-game-button-container {
        position: relative;
        z-index: 1;
    }

    #win-message {
        font-size: 70px;
        margin-top: 24px;
    }

    #win-caption {
        font-size: 35px;
        margin-top: 12px; 
    }

    #win-time {
        font-size: 35px;
        margin-top: 12px; 
    }

    #win-clicks {
        font-size: 30px;
        margin-top: 12px;
    }
    #path-and-new-game-button-container {
        font-size: 20px;
        text-align: center;
    }

    /* #win-message, #win-caption, #win-time, #win-clicks {
        text-align: center;
        position: fixed;
        width: 100%;
        z-index: 100; 
    } */

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
        top: 0px;
        right:0px;
        height:100%;
        width: 125px; 
        padding: 5px 5px 5px 5px;
        z-index: 50;
        border-left-style: groove;
        border-left-color: #94d4d0;
        border-left-width: 7px;
        background-color: #edf6f7;
        font-family: 'Varela Round';
        font-size: 1em;
        color: black;
        overflow-x: hidden;
        transition: 0.5s;
    }

    .sidePanel .closeStats {
        position: absolute;
        top: 0;
        right: 80%;
        font-size: 1.5em;
        margin-left: 50px;
        text-decoration: none;
        color: #5aa8a8;
        padding: 5px 10px 10px 5px;
    }
    .sidePanel .closeStats:hover {
        background-color: #b5ddd9;
    }
    .openStats {
        position: fixed;
        text-align: center;
        top: 0px;
        right:0px;
        width:45px;
        height: 45px;
        padding: 0px 2px 2px 2px;
        font-family: 'Varela Round';
        font-size: 1.5em;
        z-index:49;
        cursor: pointer;
        background-color: #edf6f7;
        color: #5aa8a8;
        border: none;
    }

    .openStats:hover {
        background-color: #b5ddd9;
    }
    #timer {
        margin-bottom: 35%;
    }
    #restart-button {
        position: fixed;
        top: 85%;
        width: 110px;
        left: 10%;
        background-color: #f44336;
        color: white;
        border-radius: 4px;
        font-weight: bold; 
        transition: 0.5s;
    }

    #restart-button:hover {
        transform: translateY(-3px);
    }

    @media (hover: hover) {
        #restart-button:hover {
            background-color: #fff;
            color: #f44336;
        }
    }

    #restart-button:active {
        background-color: #fff;
        color: #f44336;
    }

    #loading-img {
        width: 40px;
        margin: auto;
        vertical-align: middle;
    }

    #loading-container {
        text-align: center;
        padding-top: 50px;
    }

    #new-game-button {
        margin: 10px;
        padding: 10px;
        background-color: #04AA6D;
        color: white;
        border-radius: 4px;
        font-weight: bold; 
        font-size: 20px;
        transition: 0.5s;
        /* border: solid black 2px; */
        border-radius: 10px;
    }

    #new-game-button:hover {
        transform: translateY(-3px);
    }

    @media (hover: hover) {
        #new-game-button:hover {
            background-color: #fff;
            color: #04AA6D;
        }
    }

    #new-game-button:active {
        background-color: #fff;
        color: #04AA6D;
    }

</style>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickLink}>
    {#if isWin}
        <div id="win-container">
            <h1 id="win-message">You Win!</h1>
            <h2 id="win-caption">You found "{ endPage }"</h2>
            <h2 id="win-time">in { elapsedTime.minutes } minutes and { elapsedTime.seconds } seconds!</h2>
            <h3 id='win-clicks'>Final Score: { count } clicks</h3>
            <div id='path-and-new-game-button-container'>
                <strong>Path:</strong> 
                {#if path.length < 15}
                    {pathString}
                {:else}
                    {#each path.slice(0, 3) as page}
                        {' '+page+' →'}
                    {/each}
                        ...{path.length - 7} more pages... →
                    {#each path.slice(-4, -2) as page}
                        {' '+page+' →'}
                    {/each}
                    {' '+path[path.length -1]}
                {/if}
                <h3 id='new-game-button-container'>
                    <button id='new-game-button' on:click={ newGame }>Replay Game</button>
                </h3>
            </div>
        </div>
    {/if}
    <!-- <input type="text" bind:value={ currPage } placeholder="Enter Wikipedia page title" /> -->
    <!-- <button on:click={ fetchWikiPage }>Load Page</button> -->
    <div 
        id= "overlay-container"
        style="filter: blur({isWin ? '5px' : '0px'})"
        class="sidePanel"    
    >
        <a href="javascript:void(0)" class="closeStats" on:click={ closeStats }>&gt;</a>
        <img class="logoimage s-7IPF32Wcq3s8" src="src/lib/assets/wikilogo2.png" alt="Logo">
        <p id="click-counter"><b> {count} clicks </b></p> <!-- counter is at the bottom, not formated the best-->
        <p id="timer"><b><Timer bind:this={ timerComponent } /></b></p>
        <p> <b> {firstPage} </b></p>
        <p> <b>⬇️</b>
        <p> <b> {endPage} </b> 
        </p>
        <button id='restart-button' on:click={ restartGame }>Restart Game</button>
    </div>
    <button class="openStats" on:click={ openStats }>&lt;</button>
    <div 
        id="main-container"
        style="filter: blur({isWin ? '5px' : '0px'})"
    >
        {#if !isLoading}
            <div id="wiki-page-container">
                {#if currPage}
                    <h1>{ currPage }</h1>
                {/if}
                {@html pageContent} <!-- loads content -->
            </div>
        {:else}
            <div id="loading-container">
                <img id="loading-img" src="/loading.gif" alt="loading..." />
            </div>
        {/if}
    </div>
</main>