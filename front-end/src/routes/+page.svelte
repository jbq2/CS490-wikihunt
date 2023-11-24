<script lang="ts">
    import WikiGame from "../shared-components/WikiGame.svelte";
    import { mediaWikiService } from "../services/MediaWikiService";  
    import type { PageApiResponse, StartEndApiResponse } from "../constants/models";
    let startCheck: boolean = false;
    let loading: boolean = false;
    let fetchedFirstPage: string = "";
    let fetchedEndPage: string | undefined = undefined; // has to be different than wikiPage initially
    
    function start(): void {
        loading = true;
        mediaWikiService.getDailyWordsFromApi()
            .then((data: StartEndApiResponse) => {
                fetchedFirstPage = data.start;
                fetchedEndPage = data.end;
                loading = false;
                startCheck = true;
            });
    }
</script>
<style>
    @import url('https://fonts.googleapis.com/css?family=Varela Round');

    :global(body) { 
        margin: 0; 
        padding: 0; 
    }
    .centered-container {
        flex: 1;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #edf6f7;
        font-family: 'Varela Round';
        padding-top: 1%;
    }

    .page-content {
        margin: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    h1 {
        color: #333;
    }

    p {
        color: #666;
        font-size: 16px;
    }

    ul {
        color: #666;
        list-style-type: square;
        padding-left: 20px;
    }

    li {
        margin: 10px 0;
    }

    #start-button {
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

    #start-button:hover {
        transform: translateY(-3px);
    }

    @media (hover: hover) {
        #start-button:hover {
            background-color: #fff;
            color: #04AA6D;
        }
    }

    #start-button:active {
        background-color: #fff;
        color: #04AA6D;
    }

</style>

<main>
    {#if !startCheck && !loading}
        <div class="centered-container">
            <a class="logolink" href="/">
                <img class="logoimage" src={'src/lib/assets/wikilogo3.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1>Welcome to WikiHunt!</h1>
            <div class="page-content">
                <p>Welcome to WikiHunt, a Wikipedia game where the player must navigate from one randomly selected article to another pre-selected article.</p>
                <h1>Rules</h1>
                <ul>
                    <li>The user can only navigate by only clicking through links within the same article. No search bar allowed!</li>
                    <li>The user must do this with as little time as possible and with the least amount of clicks.</li>
                    <li>No backtracking!</li>
                </ul>
            </div>
            <button id="start-button" on:click={ start }>Start Game</button>
        </div>
    {:else if loading && !startCheck}
        <div class="centered-container">
            <a class="logolink" href="/">
                <img class="logoimage" src={'src/lib/assets/wikilogo3.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1>Welcome to WikiHunt!</h1>
            <div class="page-content">
                <h1>Loading Game...</h1>
            </div>
        </div>
    {:else}
        <WikiGame
            origStart = {fetchedFirstPage}
            origEnd = {fetchedEndPage}
        />
    {/if}
</main>




<!-- <h1 style="text-align: center;">Welcome to WikiHunt!</h1> -->


<!-- <style>
    .centered-container{
        text-align: center;
        display: flex;
        align-items: center;
    
    }
    .logoimage{
        width: 100px;
        height: auto;
    }
</style>

<div class="centered-container">
    <img class = "logoimage" src= {'src/lib/assets/wikilogo.png'} alt="Logo"  />
</div>
-->

<!-- <p> 
    Welcome to WikiHunt, a Wikipedia game where the player must navigate from one randomly selected article and to
    another pre-selected article. </p>


<h1> Rules</h1>
<ul style = "list-style-type:square">
<li>  The user can only navigate by only clicking through links within the same article. No search bar allowed!</li>


<p> </p>
<li> 
    The user must do this with as little time as possible and with the least amount of clicks.
</li>
<p>
</p>
<li>
    No backtracking!
</li>


</ul> -->


