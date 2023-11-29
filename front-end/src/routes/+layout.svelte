<script lang='ts'>
    import GameStats from './../shared-components/GameStats.svelte';
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

    function resetBgColor(): void {
        let color = "#edf6f7"
        document.body.style.backgroundColor = color;
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
                <a id="left-link" on:click={resetBgColor} href="/"><li style="left: 1.6rem" id="nav-bar-link1">Daily</li></a>
                <a on:click={resetBgColor} href="/practice"><li id="nav-bar-link2">Practice</li></a>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a id="right-link" on:click={toggleStats}><li style="right: 1.6rem; cursor: pointer" id="nav-bar-link3" on:click={toggleStats}>Stats</li></a>
            </ul>
        </nav>
        <aside class="sidebar {isSidebarOpen ? 'open' : ''}">
            <button class="close-button" on:click={toggleSidebar}>×</button>
            <!-- svelte-ignore a11y-missing-attribute -->
            <ul style="list-style-type: none; margin-right: 5rem; padding-left: 1rem">
                <a on:click={toggleSidebar} href="/"><li>Daily</li></a>
                <a on:click={toggleSidebar} href="/practice"><li>Practice</li></a>
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <a on:click={()=>{
                    toggleStats();
                    toggleSidebar();
                }}><li style="cursor: pointer">Stats</li></a>
            </ul>
        </aside>
    </div>
    <slot />
</main>
<style>
    @import '/public/global.css';

    @import url('https://fonts.googleapis.com/css?family=Varela Round');

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