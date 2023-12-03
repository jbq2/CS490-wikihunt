<script lang="ts">
    import WikiGame from "../shared-components/WikiGame.svelte";
    import { mediaWikiService } from "../services/MediaWikiService";  
    import type { PageApiResponse, StartEndApiResponse } from "../constants/models";
    import CopyButton from "../shared-components/CopyButton.svelte";
    //import DarkModeToggle from "../shared-components/DarkModeToggle.svelte";
    import { onMount } from 'svelte'
   // import {darkMode} from 
    import {darkMode} from '../lib/darkModeStore'
    let startCheck: boolean = false;
    let loading: boolean = false;
    let fetchedFirstPage: string = "";
    let fetchedEndPage: string | undefined = undefined; // has to be different than wikiPage initially


    let logoImageSrc = 'src/lib/assets/wikilogo3.png'; 

    function start(): void {
        loading = true;

    
        
        mediaWikiService.getDailyWordsFromApi()
            .then((data: StartEndApiResponse) => {
                fetchedFirstPage = data.start;
                fetchedEndPage = data.end;
                loading = false;
                startCheck = true;
                //changeBgColor();
            });
    }

   


    function returnHome(): any {
        startCheck = false;
        loading = false;
       
       // changeBgColor();
    }

  

    

    function changeBgColor(): void {
       // if (document.body.classList.contains('dark')) {
        // Dark mode background color
       // document.body.style.backgroundColor = "#1a1a1a"; // Adjust this to the desired dark mode background color
        // Add more dark mode specific color updates as needed
   // } else {
        // Light mode background color
       // document.body.style.backgroundColor = "#FFFFFF";
        // Add more light mode specific color updates as needed
        darkMode.update((value) => !value);
  //  }
    }

    onMount(() => {
    darkMode.subscribe(value => {
        document.body.style.color = value ? "#fff" : "#1a1a1a";
    

        
      const centeredContainer = document.querySelectorAll('.centered-container');
      centeredContainer.forEach(centeredContainer => {
        centeredContainer.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";

      });
    
        // Add more styles or adjustments as needed
      
      const pageContent = document.querySelectorAll('.page-content');
      pageContent.forEach(pageContent => {
                pageContent.style.backgroundColor = value ? "#1a1a1a" : "#FFFFFF";
                // Add more styles or adjustments as needed
            });

        const h1style = document.querySelectorAll('h1');
        h1style.forEach(h1style => {
                h1style.style.color= value? "#fff" : "#333";
                h1style.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });
            
            const p = document.querySelectorAll('p');
            p.forEach(p => {
                p.style.color= value? "#fff" : "#333";
                p.style.backgroundColor = value ? "#1a1a1a" : "#fff";
                
            });

            

            const li = document.querySelectorAll('li');
            li.forEach(li => {
                li.style.color= value? "#fff" : "#333";
                //p.style.backgroundColor = value ? "#1a1a1a" : "#fff";
                
            });
            
            const logoImage = document.querySelectorAll('.logoimage');
            logoImage.forEach(logoImage => {
                logoImageSrc = value ? 'src/lib/assets/wikilogo3transparent.png' : 'src/lib/assets/wikilogo3.png';
                logoImage.src = logoImageSrc;
            });

        
    
           
           
           
      
     



    });

  });


</script>
<style>

    @import url('https://fonts.googleapis.com/css?family=Varela Round');
    @import "../app.css";
    @import '/public/global.css';

    
    .centered-container {
        flex: 1;
        height: 100%;
        text-align: center;
        
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        font-family: 'Varela Round';
        padding-top: 1%;
        padding-bottom: 1%;
    }
  
    

    
   
    @media(max-width: 450px) {
        .centered-container {
            margin-top: 5%;
        }
    }
     



    .page-content {
        margin: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    

    h1 {
        color:#333
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

   





</style>

<main>
    {#if !startCheck && !loading}
        <div class="centered-container">
            <a class="logolink" href="/">
                <img class="logoimage" src={'src/lib/assets/wikilogo3transparent.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1>
                Welcome to WikiHunt!</h1>
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
            dailyMode = {true}
            returnHome = {returnHome}
        />
    {/if}
</main>


