<script lang="ts">
    import WikiGame from "../../shared-components/WikiGame.svelte";
    import { mediaWikiService } from "../../services/MediaWikiService";  
   // import DarkModeToggle from "../../shared-components/DarkModeToggle.svelte";
    import type { PageApiResponse, StartEndApiResponse } from "../../constants/models";
    let startCheck: boolean = false;
    let loading: boolean = false;
    let fetchedFirstPage: string = "";
    let fetchedEndPage: string | undefined = undefined; // has to be different than wikiPage initially
    import {darkMode} from '../../lib/darkModeStore'
    import CopyButton from "../../shared-components/CopyButton.svelte";
    import { afterUpdate, onMount } from "svelte";

    let logoImageSrc = 'src/lib/assets/wikilogo3transparentlightmode.png'; 

    function start(): void {
        loading = true;
       // if(loading){
     //   const loadingContainer = document.querySelectorAll('.loading-container');
      //      loadingContainer.forEach(loadingContainer => {
       //         loadingContainer.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
   //         });

        
        mediaWikiService.getRandomWordsFromApi()
            .then((data: StartEndApiResponse) => {
                fetchedFirstPage = data.start;
                fetchedEndPage = data.end;
                loading = false;
                startCheck = true;
                //changeBgColor();
            });
    }

    function returnHome(): any {
        
        applyDarkModeStyles()
        startCheck = false;
        loading = false;

        //changeBgColor();
        
    }


    function applyDarkModeStyles() {
    const value = $darkMode; // Get the current dark mode value
    // Add your dark mode styling logic here
    updateStylesPractice(value);
  }
  

    function updateStylesPractice(value: boolean): void {


        

        darkMode.subscribe(value => {

          
            const body = document.querySelector("body");
            if (body){
                body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
            }
    
        
        //document.body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
 
        const centeredContainer = document.querySelector("#maincenter");
      if (centeredContainer) {
        centeredContainer.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
        // Add more styles or adjustments as needed
      }
      const pageContent = document.querySelector('#practice-pagecontent');
            if (pageContent) {
                pageContent.style.backgroundColor = value ? "#1a1a1a" : "#FFFFFF";
                pageContent.style.color= value? "#fff" : "#1a1a1a";
            }

        const h1style = document.querySelectorAll('h1');
        h1style.forEach(h1style => {
               h1style.style.color= value? "#fff" : "#333";
               // h1style.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });
            const p = document.querySelectorAll('#forfun');
            p.forEach(p => {
                p.style.color= value? "#fff" : "#333";
                p.style.backgroundColor = value ? "#1a1a1a" : "#fff";
                
            });

            const logoImage = document.querySelectorAll('.logoimage');
            logoImage.forEach(logoImage => {
                logoImageSrc = value ? 'src/lib/assets/wikilogo3transparentdarkmode.png' : 'src/lib/assets/wikilogo3transparentlightmode.png';
                logoImage.src = logoImageSrc;
            });
    
           
             
            // Add more styles or adjustments as needed loadingimage
            const loadingImage = document.querySelectorAll('#loadingimage');
            loadingImage.forEach(loadingImage => {
                logoImageSrc = value ? 'src/lib/assets/wikilogo3transparentdarkmode.png' : 'src/lib/assets/wikilogo3transparentlightmode.png';
                loadingImage.src = logoImageSrc;
            });

         const loadingContain= document.querySelector("#loadingcontainer");
         if (loadingContain) {
            loadingContain.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
        // Add more styles or adjustments as needed
      }

      const loadingh1 = document.querySelectorAll('#loadingh1');
            loadingh1.forEach(loadingh1 => {
                loadingh1.style.color= value? "#fff" : "#1a1a1a";
                loadingh1.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });
     
            const pageload = document.querySelectorAll('#pageload');
            pageload.forEach(pageload => {
                //pageload.style.color= value? "#fff" : "#1a1a1a";
                pageload.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
                
            });



    });
        

       
    } 

   


    onMount(() => {
        applyDarkModeStyles()

        
  });


  afterUpdate(() => {
        
        //document.body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
 

        applyDarkModeStyles()
           
           
      
     



  });

  
</script>
<style>
    @import url('https://fonts.googleapis.com/css?family=Varela Round');
    @import '/public/global.css';

    :global(body) { 
        margin: 0; 
        padding: 0;
        background-color: #edf6f7;
      
    }

    .loading-container {
        /* Add styles for the loading container */
        background-color: #fff; /* Customize the background color */
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .loading-container h1 {
        color: #333; /* Customize the text color */
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
        color: #333;
    }

    p {
        color: #666;
        font-size: 16px;
    }

 

    /* ul {
        color: #666;
        list-style-type: square;
        padding-left: 20px;
    }

    li {
        margin: 10px 0;
    } */

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
        <div id = "maincenter" class="centered-container">
            <a class="logolink" href="/">
                <img class="logoimage" src={'src/lib/assets/wikilogo3transparentlightmode.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1>Practice Mode</h1>
            <div id= "practice-pagecontent" class="page-content">
                <!-- <h1>Practice Mode</h1> -->
                <p id="forfun">Play WikiHunt for fun! </p>
                <p id="forfun">Two randomly selected words are chosen each time you play.</p>
                <!-- <h1>Rules</h1>
                <ul>
                    <li>The user can only navigate by only clicking through links within the same article. No search bar allowed!</li>
                    <li>The user must do this with as little time as possible and with the least amount of clicks.</li>
                    <li>No backtracking!</li>
                </ul>  -->
            </div>
            <button id="start-button" on:click={ start }>Start Practice</button>
        </div>
    {:else if loading && !startCheck}
    <div class="centered-container" id ='loadingcontainer'>
            <a class="logolink" href="/">
                <img class="logoimage" id='loadingimage' src={'src/lib/assets/wikilogo3transparentlightmode.png'} alt="Logo">
                <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
            </a>
            <h1 id = "loadingh1"> Practice Mode</h1>
            <div class="page-content"  id = "pageload">
                <h1 id = "loadingh1">Loading Game...</h1>
            </div>
        </div>
    {:else}
        <WikiGame
            origStart = {fetchedFirstPage}
            origEnd = {fetchedEndPage}
            dailyMode = {false}
            returnHome = {returnHome}
        />
    {/if}
</main>