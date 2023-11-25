<script lang="ts">
	import Modal from './Modal.svelte';
	import { today, readFromCookie, dailyStreakCookieName, lastPlayedCookieName, allTimeBestCookieName } from '$lib/CookieHelper';
	import type { DateFormat, Stats } from "../constants/models";

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

		// let date: string = dateFormatter(allTimeBest.date);
		// let path: string = allTimeBest.goal['start'] + ' → ' + allTimeBest.goal['end'];
		// let count: string = allTimeBest.clicks;
		// let time: string = allTimeBest.playTime.minutes + ' minutes and ' + allTimeBest.playTime.seconds + ' seconds'
		// allTimeBest = `
		// \nDate: ${date}
		// \nPath: ${path}
		// \nCount: ${count}
		// \nTime: ${time}
		// `;
		// console.log(allTimeBest)
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
			<b>All Time Best</b>:<br>{allTimeBest}
		</div> -->
		<div id='all-time-best'>
			<b>All Time Best</b>:
			{#if noCookies}
				{allTimeBest}
			{:else}
				<div>Date: {dateFormatter(allTimeBest.date)}</div>
				<div>Path: {allTimeBest.goal['start']} → {allTimeBest.goal['end']}</div>
				<div>Count: {allTimeBest.clicks}</div>
				<div>Time: {allTimeBest.playTime.minutes} minutes and {allTimeBest.playTime.seconds} seconds</div>
			{/if}
		</div>
	</div>
</Modal>
