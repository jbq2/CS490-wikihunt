<script lang="ts">
    import type { PageApiResponse, StartEndApiResponse, FinalTime, DateFormat, Stats, GameCount } from "../constants/models";
    import { mediaWikiService } from "../services/MediaWikiService";  
    import Timer from "./Timer.svelte";
    
    const date: Date = new Date();
    const today:DateFormat = {
        'month': date.getMonth()+1, 
        'day': date.getDate(),
        'year': date.getFullYear()
    }

    const dailyCookieName: string = `dailyStats`;
    const dailyStreakCookieName: string =  'dailyStreak';
    const lastPlayedCookieName: string = 'lastPlayed';
    const allTimeBestCookieName: string = 'allTimeBestStats';
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set cookie to expire in one year


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

    let timerComponent: Timer;



    function getGameStats(): string {
        let wordPair: object = {
            'start': firstPage,
            'end': endPage
        };

        return JSON.stringify({
            'date':today,
            'goal': wordPair,
            'playTime': elapsedTime,
            'clicks':count,
            'winPath': path
        });
    }

    function writeToCookie(): void {      
        let currentCookie: any = readFromCookie(dailyCookieName);
        if (currentCookie) { // cookies exist -> update them
            updateCookies(); 
            return;
        } 

        let dailyStats: string = getGameStats();

        let lastPlayed: string = JSON.stringify(today);

        let dailyStreak: string = JSON.stringify({
            'count': 1
        });

        let ATBStats: string = dailyStats;
        
        document.cookie = `${dailyCookieName}=${encodeURIComponent(dailyStats)};expires=${expiryDate.toUTCString()};path=/`;   
        document.cookie = `${allTimeBestCookieName}=${encodeURIComponent(ATBStats)};expires=${expiryDate.toUTCString()};path=/`
        document.cookie = `${dailyStreakCookieName}=${encodeURIComponent(dailyStreak)};expires=${expiryDate.toUTCString()};path=/`
        document.cookie = `${lastPlayedCookieName}=${encodeURIComponent(lastPlayed)};expires=${expiryDate.toUTCString()};path=/`
    }

    function updateCookies(): void {
        let lastPlayedDate: DateFormat = readFromCookie(lastPlayedCookieName);
        if (lastPlayedDate === today)
            return;

        let yesterday: DateFormat = {
            'day': today.day - 1,
            'month': today.month,
            'year': today.year
        };
        if (yesterday.day === 0){
            yesterday.month = today.month - 1;
            if (yesterday.month === 0) {
                yesterday.month = 12;
                yesterday.year -= 1;
            }
            if (yesterday.month === 2)
                yesterday.day = 28;
            else if ([4,6,9,11].includes(yesterday.month))
                yesterday.day = 30;
            else
                yesterday.day = 31;
        }


        let currentStreak: GameCount = readFromCookie(dailyStreakCookieName);
        if (lastPlayedDate === yesterday)
            currentStreak.count++;
        
        else 
            currentStreak.count = 1;

        

    }

    function readFromCookie(inputCookie: string): any {
        const cookies = document.cookie.split('; ');
        const targetCookie = cookies.find(row => row.startsWith(inputCookie));
        if (targetCookie) {
            const encodedData = targetCookie.split('=')[1];
            const decodedData = decodeURIComponent(encodedData);
            return JSON.parse(decodedData);
        }
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
            writeToCookie();
        } else 
            pathString += temp + ' → ';

        
        console.log("Navigating to Page: ", currPage);
        fetchWikiPage(); // show new page
    }

    function start(): void {
        startCheck = true;
        mediaWikiService.getRandomWordsFromApi()
            .then((data: StartEndApiResponse) => {
                // currPage = firstPage = data.start;
                // endPage = data.end;
                currPage = firstPage = 'Apple';
                endPage = 'Fruit';
                timerComponent.startTimer();
                fetchWikiPage();
                path.push(currPage);
                pathString += currPage + ' → ';
                console.log(`START:"${currPage}", END: "${endPage}"`);
            });
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

    #loading-img {
        width: 40px;
        margin: auto;
        vertical-align: middle;
    }

    #loading-container {
        text-align: center;
        padding-top: 50px;
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
    {/if}
</main>
