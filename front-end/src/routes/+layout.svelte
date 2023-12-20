<script lang='ts'>
    import GameStats from './../shared-components/GameStats.svelte'; 
    import {darkMode} from '../lib/darkModeStore'
    import { afterUpdate, onMount } from 'svelte';
    import {writable} from 'svelte/store'
    //import DarkModeToggle from '../shared-components/DarkModeToggle.svelte';
   import { page } from '$app/stores';
    let isSidebarOpen = false;
    let showStats: boolean = false;
    let shekhmus: GameStats;

    function toggleSidebar(): void {
        isSidebarOpen = !isSidebarOpen;
    }

    function clickOff(event: any): void {
        if (isSidebarOpen){
            let tag: string = event.target.tagName;
            const tags: string[] = ['BUTTON', 'ASIDE', 'UL', 'LI']
            if (tags.indexOf(tag) === -1)
                toggleSidebar();
        }
    }

    function toggleStats(): void {
        showStats = !showStats;
        shekhmus.updateStats();
    }

  

    function toggleDarkMode() {
        // Update the darkMode store on button click
        darkMode.update((value) => !value);
        
    }
    onMount(() => {

        const link = document.createElement('link');
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
    darkMode.subscribe(value => {

     // document.body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
     // document.body.style.color = value ? "#fff" : "#1a1a1a";


     //nav bar
     const navItems = document.querySelectorAll('.nav-bar li');
      navItems.forEach(item => {
        item.style.backgroundColor = value ? "#444" : "#fff"; 
       item.style.color = value ? "#fff" : "#1a1a1a"// Adjust this to the desired color
      });




     

      //mobile side bar
      const sidebar = document.querySelector('.sidebar');
      if(sidebar){
        sidebar.style.backgroundColor = value ? "black": "white";
      }
      


      
    });
  });

  afterUpdate(() => {
    darkMode.subscribe(value => {

    //  document.body.style.backgroundColor = value ? "#1a1a1a" : "#edf6f7";
    //  document.body.style.color = value ? "#fff" : "#1a1a1a";


     //nav bar
      const navItems = document.querySelectorAll('.nav-bar li');
      navItems.forEach(item => {
        item.style.backgroundColor = value ? "#444" : "#fff"; 
        item.style.color = value ? "#fff" : "#1a1a1a"// Adjust this to the desired color
      });

      //mobile side bar
      const sidebar = document.querySelector('.sidebar');
      if(sidebar){
        sidebar.style.backgroundColor = value ? "black": "white";
        sidebar.color = value ? "#fff": "#1a1a1a"
      }

      
      const moonIcon = document.querySelector('.moon-icon');
        if (moonIcon) {
            // Add your styles for the moon icon (e.g., color: white)
            moonIcon.style.color = "#fff"; //works
        }
        const sunIcon = document.querySelector('.sun-icon');
        if (sunIcon) {
            // Add your styles for the moon icon (e.g., color: white)
            sunIcon.style.color = "#fff"; //works

        }

        const mobileli = document.querySelectorAll('mobileli');
      mobileli.forEach(item => {
        item.style.backgroundColor = value ? "#444" : "#fff"; 
        item.style.color = value ? "#ff0000" : "#1a1a1a"// Adjust this to the desired color
      });

    

        
      

      


      
    });
  });

    function resetBgColorDaily(): void {
        if ($page.url.pathname != "/") {
            let color = "#edf6f7";
            document.body.style.backgroundColor = color;
        }
    }

    function resetBgColorPractice(): void {
        if ($page.url.pathname != "/practice") {
            let color = "#edf6f7";
            document.body.style.backgroundColor = color;
        }
    }
</script>

<GameStats 
    bind:this={ shekhmus }
    showModal = {showStats}
/>
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={clickOff}>
    <div id="header">
        <div id="hamburger-and-logo">
            {#if !isSidebarOpen}
                <button class="hamburger-menu" on:click={toggleSidebar}>☰</button>
            {/if}
        </div>
        <nav class="nav-bar" style="text-align: center">
            <ul style="padding: 0 0 0 20px;" id="nav-bar">
                <a id="left-link" href="/"><li style="left: 1.6rem" id="nav-bar-link1">Daily</li></a>
                <a href="/practice"><li id="nav-bar-link2">Practice</li></a>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a id="right-link" on:click={toggleStats}><li style="right: 1.6rem; cursor: pointer" id="nav-bar-link3" on:click={toggleStats}>Stats</li></a>
                <button id="darkmodeWeb" class="dark-mode-toggle" on:click={toggleDarkMode}>
                    {#if $darkMode}
                        <i class="fas fa-sun sun-icon"></i> Light Mode
                    {:else}
                        <i class="fas fa-moon moon-icon"></i> Dark Mode
                    {/if}
                </button>
            </ul>
        </nav>
        <aside class="sidebar {isSidebarOpen ? 'open' : ''}">
            <button class="close-button" on:click={toggleSidebar}>×</button>
            <!-- svelte-ignore a11y-missing-attribute -->
            <ul style="list-style-type: none; margin-right: 5rem; padding-left: 1rem">
                <a on:click={toggleSidebar} href="/"><li id = "mobileli">Daily</li></a>
                <a on:click={toggleSidebar} href="/practice"><li  id = "mobileli">Practice</li></a>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a on:click={()=>{
                    toggleStats();
                    toggleSidebar();
                }}><li style="cursor: pointer" id = "mobileli">Stats</li></a>
                  <button id="darkmodeMobile" class="dark-mode-toggle" on:click={toggleDarkMode}>
                    {#if $darkMode}
                    <i class="fas fa-sun sun-icon"></i>
                {:else}
                    <i class="fas fa-moon moon-icon"></i>
                {/if}
                </button>
           </ul>
        </aside>
    </div>
    <slot />
</main>
<style>
    @import '/public/global.css';

    @import url('https://fonts.googleapis.com/css?family=Varela Round');


    :global(body) { 
    margin: 0; 
    padding: 0;

  }

  
 
   
    
    nav ul li {
        font-family: 'Varela Round';
        border-radius: 0px;
        border: 2px #dedede;
        border-style: groove;
        position: relative;
        margin: 0;
        text-align: center;
    }
    nav ul li::before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background-color: green; 
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    nav ul li:hover::before {
        opacity: 1;
    }

    #nav-bar-link1, #nav-bar-link2, #nav-bar-link3 {
        list-style-position: relative;
        width: 5rem;
    }   

    #nav-bar-link1, #nav-bar-link2 {
        text-indent: -1rem;
    }

    #nav-bar-link3 {
        text-indent: -0.25rem;
    }
   


#darkmodeWeb{
        background-color: #000080; /* Adjust background color */
    color: #fff; /* Adjust text color */
    border: none;
    padding: 10px;
    font-weight: bold; 
    margin-left: 10px; /* Adjust spacing */
    cursor: pointer;
    font-family: 'Varela Round';
        border-radius: 4px;
       

}

#darkmodeMobile{
        background-color: #000080; /* Adjust background color */
    color: #fff; /* Adjust text color */
    border: none;
    padding: 10px;
    font-weight: bold; 
    cursor: pointer;
    font-family: 'Varela Round';
        border-radius: 4px;
       

}




    .hamburger-menu {
        display: none; 
        left: 1rem;
        position: absolute;
        z-index: 50;
        margin-top: 15px;
    }

    .sidebar {
        font-family: 'Varela Round';
        position: fixed;
        z-index: 50;
        width: 100px;
        top: 0;
        left: -300px;
        height: 100%;
        background: white;
        transition: left 0.3s;
        opacity: 0.9;
    }

    .sidebar.open {
        left: 0;
    }

    .close-button {
        margin-right: 2.5rem;
    }

    @media screen and (max-width: 450px) {
        .nav-bar { display: none; }
        .hamburger-menu { display: inline-block; }
    }

</style>