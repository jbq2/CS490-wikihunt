<script lang="ts">
	import Modal from './Modal.svelte';
	import { readFromCookie, dailyStreakCookieName, lastPlayedCookieName, allTimeBestCookieName } from '$lib/CookieHelper';
	import type { DateFormat, Stats } from "../constants/models";
	import today from './WikiGame.svelte';

	let showModal: boolean = false;
	let noCookies: boolean = false;
	let allTimeBest: Stats | any | undefined = readFromCookie(allTimeBestCookieName);
	let lastPlayed: DateFormat | any;
	let streak: number;
	const fireEmoji: string = '🔥';
	if (!allTimeBest){
		noCookies = true;
		allTimeBest = 'No Records!';
		lastPlayed = 'No Records!';
		streak = 0;
	}
	else{
		lastPlayed = readFromCookie(lastPlayedCookieName);
		if (JSON.stringify(lastPlayed) === JSON.stringify(today))
			lastPlayed = 'Today 😎';
		else
			lastPlayed = dateFormatter(lastPlayed);
		streak = readFromCookie(dailyStreakCookieName).count;
	}

	function dateFormatter(date: DateFormat): string  {
		return `${date.month}/${date.day}/${date.year}`
	}

</script>

<button on:click={() => (showModal = true)}>Stats</button>

<Modal bind:showModal>
	<h2 slot="header">
		Player Statistics 💯
	</h2>

	<div style="list-style-type" class="grid">
		<div id='last-and-streak'><b>Last Played</b>: {lastPlayed}</div>
		<div id='last-and-streak'><b>Daily Streak</b>: {streak}{streak ? fireEmoji : ''}</div>
		<!-- <div id='all-time-best'>
			All Time Best:
			{#if noCookies}
				{allTimeBest}
			{:else}
				Date: {dateFormatter(allTimeBest.date)}
				Path: {allTimeBest.path.start} → {allTimeBest.path.end}
				Count: {allTimeBest.clicks}
				Time: {allTimeBest.playTime.minutes} minutes and {allTimeBest.playTime.seconds}
			{/if}
		</div> -->
	</div>
</Modal>
