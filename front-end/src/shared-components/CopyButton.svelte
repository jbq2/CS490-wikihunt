<script>
	import { copyText } from '$lib/CookieHelper';

    let showText = false;

    function handleClick() {
        showText = true;
        copyText();
        
        setTimeout(() => {
            showText = false;
        }, 3000);
    }
</script>

<style>
    @import '../../public/global.css';
    .fade {
        opacity: 0;
        transition: opacity 1s ease-in-out;
    }

    .visible {
        opacity: 1;
        transition: opacity 0.5s ease-in-out;
    }

    #copy-button, #copy-text {
        position: relative;
        right: 0.5rem;
    }
</style>

<button id="copy-button" style="cursor: pointer" on:click={handleClick}>Share🔗</button>
<span id='copy-text' class={showText ? 'visible' : 'fade'}>Copied to Clipboard!</span>
