<script lang="ts">
    let minutes = 0;
    let seconds = 0;
    let timer: number;
    let isRestart = false;

    type FinalTime = {
        minutes: number,
        seconds: number
    }

    export function startTimer(): void {
        stop();
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


            if(isRestart){
                isRestart = false;
                minutes = 0;
                seconds = 0;
            }
        }, 1000);
    }

    export function stop(): void {
        clearInterval(timer);
    }
    export function restart(): void {
        isRestart = true;
    }

    // export function getTime(): string {
    //     return `${minutes} minutes and ${seconds} seconds!`
    // }

    export function getTime(): FinalTime {
        let time: FinalTime = {
            'minutes': minutes,
            'seconds': seconds
        }
        return time;
    }
</script>

<main>
    <!-- <h1>Count-up Timer</h1> -->
    <div class="timer">
       Time: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
    </div>
</main>

<style>
    main {
        text-align: center;
    }

    .timer {
        /* font-size: 2em; */
    }
</style>
