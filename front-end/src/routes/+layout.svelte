<script lang='ts'>
    import GameStats from './../shared-components/GameStats.svelte';
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
                <a id="left-link" on:click={resetBgColorDaily} href="/"><li style="left: 1.6rem" id="nav-bar-link1">Daily</li></a>
                <a on:click={resetBgColorPractice} href="/practice"><li id="nav-bar-link2">Practice</li></a>
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

</style>