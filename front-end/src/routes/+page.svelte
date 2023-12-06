<script lang="ts">
    import WikiGame from "../shared-components/WikiGame.svelte";
    import { mediaWikiService } from "../services/MediaWikiService";  
    import type { PageApiResponse, StartEndApiResponse } from "../constants/models";
    import CopyButton from "../shared-components/CopyButton.svelte";
    //import DarkModeToggle from "../shared-components/DarkModeToggle.svelte";
    import { afterUpdate, onMount } from 'svelte'
   // import {darkMode} from 
    import {darkMode} from '../lib/darkModeStore'
    let startCheck: boolean = false;
    let loading: boolean = false;
    let fetchedFirstPage: string = "";
    let fetchedEndPage: string | undefined = undefined; // has to be different than wikiPage initially


    let logoImageSrc = "/assets/wikilogo3.png"; 

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
        applyDarkModeStyles();
        startCheck = false;
        loading = false;
       
        //location.reload()

    }

    

   function applyDarkModeStyles() {
    const value = $darkMode; // Get the current dark mode value
    // Add your dark mode styling logic here
    updateStyles(value);
  }
  

    function updateStyles(value: boolean): void {


        darkMode.subscribe(value => {

            const body = document.querySelector("body");
            if (body){
                body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
            }
    
       const centeredContainer = document.querySelectorAll('.centered-container');
      centeredContainer.forEach(centeredContainer => {
        //centeredContainer.style.color = value ? "#fff" : "#1a1a1a";
      });
    
        // Add more styles or adjustments as needed
      
       const pageContent = document.querySelectorAll('.page-content');
      pageContent.forEach(pageContent => {
                pageContent.style.backgroundColor = value ? "#1a1a1a" : "#FFFFFF";
               
            pageContent.style.color = value ? "#fff" : "#1a1a1a";
              const h2rule = document.querySelector('rule');
        if(h2rule){
            h2rule.style.color= value? "#fff" : "#333";

          } 

          const li = document.querySelectorAll('li');
            li.forEach(li => {
               li.style.color= value? "#fff" : "#333";
                //p.style.backgroundColor = value ? "#1a1a1a" : "#fff";
                
           }); 
    
            });
            

        const h1style = document.querySelectorAll('#welcome');
        h1style.forEach(h1style => {
                h1style.style.color= value? "#fff" : "#1a1a1a";
                //h1style.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });

            const loadingh1 = document.querySelectorAll('#loadingh1');
            loadingh1.forEach(loadingh1 => {
                loadingh1.style.color= value? "#fff" : "#1a1a1a";
                //h1style.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });
            
            const logoImage = document.querySelectorAll('#mainlogo');
            logoImage.forEach(logoImage => {
                logoImageSrc = value ? '/assets/wikilogo3transparentdarkmode.png' : '/assets/wikilogo3.png';
                logoImage.src = logoImageSrc;
            });

            const loadingImage = document.querySelectorAll('#loadinglogo');
            loadingImage.forEach(loadingImage => {
                logoImageSrc = value ? '/assets/wikilogo3transparentdarkmode.png' : '/assets/wikilogo3.png';
                loadingImage.src = logoImageSrc;
            });


           

         const p = document.querySelector('#welcometext');
        if(p){
        p.style.backgroundColor = value ? "#1a1a1a": "#fff";
        p.style.color = value ? "#fff" : "#333";
          } 

        
            
        
            

        
    
           
           
           
      
     



    });

    

           
            

           


    }



    onMount(() => {
   
        applyDarkModeStyles()

  });

  afterUpdate(() =>{
    applyDarkModeStyles()
  })


</script>
<style>

    @import url('https://fonts.googleapis.com/css?family=Varela Round');
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
        color:#1a1a1a
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
                <img class="logoimage" id='mainlogo' src={'/assets/wikilogo3.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1 id= "welcome">
                Welcome to WikiHunt!</h1>
            <div class="page-content">
                <p id = "welcometext">Welcome to WikiHunt, a Wikipedia game where the player must navigate from one randomly selected article to another pre-selected article.</p>
                <h2 id= "rule">Rules</h2>
                <ul>
                    <li>The user can only navigate by only clicking through links within the same article. No search bar allowed!</li>
                    <li>The user must do this with as little time as possible and with the least amount of clicks.</li>
                    <li>No backtracking!</li>
                </ul>
            </div>
            <button id="start-button" on:click={ start }>Start Game</button>
        </div>
    {:else if loading && !startCheck}
        <div class="centered-container" id ='loading-centered-container'>
            <a class="logolink" href="/">
                <img class="logoimage" id='loadinglogo' src="/assets/wikilogo3.png" alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1 id = "loadingh1">Welcome to WikiHunt!</h1>
            <div class="page-content">
                <h1 id = "loadingh1" >Loading Game...</h1>
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
