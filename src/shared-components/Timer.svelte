<script>
    import { onMount } from "svelte";

    let minutes = 0;
    let seconds = 0;
    let isWin = false;

    function startTimer() {
        // Update the timer every second
        const interval = setInterval(() => {
            if (seconds === 59) {
                minutes++;
                seconds = 0;
            } else {
                seconds++;
            }

            if(isWin) {
                clearInterval(interval);
            }
        }, 1000);
        // Stop the timer after a certain duration (if needed)
        // For example, to stop the timer after 5 minutes, you can use:
        // setTimeout(() => {
        //   clearInterval(interval);
        // }, 300000);
    }

    export function stop() {
        isWin = true;
    }

    onMount(() => {
        startTimer();
    });
</script>

<main>
    <h1>Count-up Timer</h1>
    <div class="timer">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
</main>

<style>
    main {
        text-align: center;
    }

    .timer {
        font-size: 2em;
    }
</style>
