<!-- DarkModeSwitcher.svelte -->
<script>
    export let isDarkMode = false;
    export let toggleDarkMode = () => {};
  </script>
  
  <button on:click={toggleDarkMode}>
    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
  </button>