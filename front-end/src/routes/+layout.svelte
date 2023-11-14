<script>
    let isSidebarOpen = false;

    function toggleSidebar() {
        isSidebarOpen = !isSidebarOpen;
    }
</script>

<div id="header">
    <a href="/">
        <img class="logoimage" src={'src/lib/assets/wikilogo2.png'} alt="Logo">
        <!-- <h1 style="margin: 0 10px;">WikiHunt</h1> -->
    </a>
    
    <nav class="nav-bar" style="text-align: center">
        <ul style="padding: 0 0 0 20px;" id="nav-bar">
            <a id="left-link" href="/"><li style="left: 1.6rem" id="nav-bar-link1">Home</li></a>
            <a href="/wiki"><li id="nav-bar-link2">Play</li></a>
            <a id="right-link" href="/leaderboard"><li style="right: 1.6rem" id="nav-bar-link3">Leaderboard</li></a>
        </ul>
    </nav>
    <button class="hamburger-menu" on:click={toggleSidebar}>☰</button>
    <aside class="sidebar {isSidebarOpen ? 'open' : ''}">
        <button class="close-btn" on:click={toggleSidebar}>×</button>
        <ul style="list-style-type: none">
            <a on:click={toggleSidebar} id="left-link" href="/"><li style="left: 1.6rem" id="nav-bar-link1">Home</li></a>
            <a on:click={toggleSidebar} href="/wiki"><li id="nav-bar-link2">Play</li></a>
            <a on:click={toggleSidebar} id="right-link" href="/leaderboard"><li style="right: 1.6rem" id="nav-bar-link3">Leaderboard</li></a>
        </ul>
    </aside>
</div>
<slot />

<style>
    @import '/public/global.css';

    nav ul li {
        border-radius: 0px;
        border: 2px #dedede;
        border-style: groove;
        position: relative;
        margin: 0;
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
        margin: 0;
    }

    .sidebar {
        position: fixed;
        width: 150px;
        top: 0;
        left: -300px;
        height: 100%;
        background: white;
        transition: left 0.31s;
        opacity: 0.9
    }

    .sidebar.open {
        left: 0;
    }

    @media screen and (max-width: 392px) {
        .nav-bar { display: none; }
        .hamburger-menu { display: block; }
    }

</style>