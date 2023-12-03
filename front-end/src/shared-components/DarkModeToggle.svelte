<!-- DarkModeToggle.svelte 
<script>
  export let darkMode = false;

  function toggleDarkMode() {
      darkMode = !darkMode;
      // You can perform additional actions here, such as saving the dark mode state to local storage.
  }
</script>

<button on:click={toggleDarkMode} class="{darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}">
  {darkMode ? 'Light Mode' : 'Dark Mode'}
</button>

<style>
  /* Add any additional styles as needed */
</style>
-->