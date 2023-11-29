<script lang="ts">
	import Modal from './Modal.svelte';
	import CopyButton from './CopyButton.svelte'
	import { today, readFromCookie, dailyCookieName, dailyStreakCookieName, lastPlayedCookieName, allTimeBestCookieName, copyText, dateFormatter } from '$lib/CookieHelper';
	import type { DateFormat, Stats } from "../constants/models";
	import { onMount } from 'svelte';

	const fireEmoji: string = '🔥';
	export let showModal: boolean = false;
	let noCookies: boolean = false;
	let allTimeBest: Stats | any;
	let allTimeBestString: string, dailyString: string = 'No Records!';
	let cookieCheck: boolean = false;
	let lastPlayed: DateFormat | any;
	let streak: number;
	let dailyGame: Stats | any;
	onMount(() => {
		updateStats();
	});

	export function updateStats(): void {
		dailyGame = undefined;
		noCookies = false;
		allTimeBestString = 'No Records!', dailyString = 'No Records!';
		cookieCheck = false;
		console.log('here')
		allTimeBest = readFromCookie(allTimeBestCookieName);
		if (allTimeBest)
			cookieCheck = true;
		
		if (!allTimeBest){
			allTimeBestString = "No Records!";
			lastPlayed = 'No Records!';
			streak = 0;
		}
		else{
			noCookies = true;
			lastPlayed = readFromCookie(lastPlayedCookieName);
			if (JSON.stringify(lastPlayed) === JSON.stringify(today))
				lastPlayed = 'Today 😎';
			else
				lastPlayed = dateFormatter(lastPlayed);
			streak = readFromCookie(dailyStreakCookieName).count;
			dailyGame = readFromCookie(dailyCookieName);
			if (JSON.stringify(today) !== JSON.stringify(dailyGame.date)){
				dailyGame = undefined;
				dailyString = 'No Records!';
			}
		}
	}

</script>

<style>
	@import '../../public/global.css';
    @import url('https://fonts.googleapis.com/css?family=Varela Round');
    
	h2, div {
		font-family: 'Varela Round';
	}
</style>

<Modal bind:showModal>
	<h2 slot="header">
		Player Statistics 💯
	</h2>

	<div style="list-style-type" class="grid">
		<div id='last-and-streak'><b>Last Played</b>: {lastPlayed}</div>
		<div id='last-and-streak'><b>Daily Streak</b>: {streak}{streak ? fireEmoji : ''}</div>
		<div id='all-time-best'>
			<div><b>All Time Best</b>:
			{#if !noCookies}
				{' '+allTimeBestString}
			{:else}
				<div>Date: {dateFormatter(allTimeBest.date)}</div>
				<div>Goal: {allTimeBest.goal['start']} → {allTimeBest.goal['end']}</div>
				<div>Clicks: {allTimeBest.clicks}</div>
				<div>Time: {allTimeBest.playTime.minutes} minutes and {allTimeBest.playTime.seconds} seconds</div>
			{/if}
		</div>
	</div>
	<hr/>
	<h2 id="daily-game-header">Daily Game Results 📅</h2>
	<hr/>
	<div>WikiHunt - {dateFormatter(today)}</div>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div id="daily-game-body">
		{#if !dailyGame}
			{dailyString}
		{:else}
			<div>Goal: {dailyGame.goal['start']} → {dailyGame.goal['end']}</div>
			<div>Clicks: {dailyGame.clicks}</div>
			<div id='daily-time'>Time: {dailyGame.playTime.minutes} minutes and {dailyGame.playTime.seconds} seconds</div>
		{/if}
		<CopyButton />
	</div>
</Modal>
