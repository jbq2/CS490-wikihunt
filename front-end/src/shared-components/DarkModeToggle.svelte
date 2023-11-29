<script>
    let isDarkMode = false;
  
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      document.body.classList.toggle('dark-mode', isDarkMode);
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
  </script>
  
  <button on:click={toggleDarkMode}>
    Toggle Dark Mode
  </button>