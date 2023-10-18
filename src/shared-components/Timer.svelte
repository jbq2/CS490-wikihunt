<script lang="ts">
    let minutes = 0;
    let seconds = 0;
    let timer: number;

    export function startTimer() {
        clearInterval(timer);
        minutes = 0;
        seconds = 0;

        timer = setInterval(() => {
            if (seconds === 59) {
                minutes++;
                seconds = 0;
            } 
            else {
                seconds++;
            }
        }, 1000);
    }

    export function stop() {
        clearInterval(timer);
    }
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
