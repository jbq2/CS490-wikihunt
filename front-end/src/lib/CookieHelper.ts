// import { _ } from "$env/static/private";
import type { DateFormat, Stats, FinalTime, GameCount, CookieCollection, StartEndApiResponse } from "../constants/models";
import { mediaWikiService } from "../services/MediaWikiService";

export const dailyCookieName: string = `dailyStats`;
export const dailyStreakCookieName: string =  'dailyStreak';
export const lastPlayedCookieName: string = 'lastPlayed';
export const allTimeBestCookieName: string = 'allTimeBestStats';
const expiryDate = new Date();
expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set cookie to expire in one year


const date: Date = new Date();
export const today: DateFormat = {
    'month': date.getMonth()+1,
    'day': date.getDate(),
    'year': date.getFullYear()
}

export function writeToCookie(gameStats: Stats): void {      
    let currentCookie: any = readFromCookie(dailyCookieName);
    let dailyStats: string = JSON.stringify(gameStats);
    let lastPlayed: string;
    let dailyStreak: string;
    let ATBStats: string;
    if (currentCookie) { // cookies exist -> update them
        let cookies: CookieCollection | undefined = updateCookies(gameStats, gameStats.date); 
        if (!cookies)
            return;

        dailyStats = JSON.stringify(cookies.dailyStats);
        lastPlayed = JSON.stringify(cookies.lastPlayed);
        dailyStreak = JSON.stringify(cookies.dailyStreak);
        ATBStats = JSON.stringify(cookies.allTimeBest);
    } 

    else {
        dailyStats = JSON.stringify(gameStats);
        lastPlayed = JSON.stringify(gameStats.date);
        dailyStreak = JSON.stringify({'count': 1});
        ATBStats = dailyStats;
    }
    
    document.cookie = `${dailyCookieName}=${encodeURIComponent(dailyStats)};expires=${expiryDate.toUTCString()};SameSite=Lax;path=/`;   
    document.cookie = `${allTimeBestCookieName}=${encodeURIComponent(ATBStats)};expires=${expiryDate.toUTCString()};SameSite=Lax;path=/`
    document.cookie = `${dailyStreakCookieName}=${encodeURIComponent(dailyStreak)};expires=${expiryDate.toUTCString()};SameSite=Lax;path=/`
    document.cookie = `${lastPlayedCookieName}=${encodeURIComponent(lastPlayed)};expires=${expiryDate.toUTCString()};SameSite=Lax;path=/`
}

function updateCookies(gameStats: Stats, today: DateFormat): CookieCollection | undefined {
    let lastPlayedDate: DateFormat = readFromCookie(lastPlayedCookieName);
    if (JSON.stringify(lastPlayedDate) === JSON.stringify(today))
        return;

    let yesterday: DateFormat = {
        'month': today.month,
        'day': today.day - 1,
        'year': today.year
    };
    if (yesterday.day === 0){
        yesterday.month = today.month - 1;
        if (yesterday.month === 0) {
            yesterday.month = 12;
            yesterday.year -= 1;
        }
        if (yesterday.month === 2)
            yesterday.day = 28;
        else if ([4,6,9,11].includes(yesterday.month))
            yesterday.day = 30;
        else
            yesterday.day = 31;
    }

    let currentStreak: GameCount = readFromCookie(dailyStreakCookieName);
    if (JSON.stringify(lastPlayedDate) === JSON.stringify(yesterday))
        currentStreak.count++;
    else 
        currentStreak.count = 1;

    let allTimeBest: Stats = readFromCookie(allTimeBestCookieName);
    let thisGameStats: Stats = gameStats;
    let betterStats: Stats = allTimeBest;

    if (allTimeBest.playTime.minutes > thisGameStats.playTime.minutes)
        betterStats = thisGameStats
    else if (allTimeBest.playTime.minutes === thisGameStats.playTime.minutes)
        betterStats = allTimeBest.playTime.seconds > thisGameStats.playTime.seconds ? thisGameStats : allTimeBest;

    return {
        'dailyStats': thisGameStats,
        // 'allTimeBest': allTimeBest.clicks < thisGameStats.clicks ? allTimeBest : thisGameStats,
        'allTimeBest': betterStats,
        'dailyStreak': currentStreak,
        'lastPlayed': today
    };
}

export function readFromCookie(inputCookie: string): any {
    const cookies =  document.cookie.split('; ');
    const targetCookie = cookies.find(row => row.startsWith(inputCookie));
    if (targetCookie) {
        const encodedData = targetCookie.split('=')[1];
        const decodedData = decodeURIComponent(encodedData);
        return JSON.parse(decodedData);
    }
}

export function dateFormatter(date: DateFormat): string  {
    return `${date.month}/${date.day}/${date.year}`
}

export async function copyText(): Promise<void> {
    let startEnd: StartEndApiResponse = await mediaWikiService.getDailyWordsFromApi();
    let dailyGame: Stats | undefined = readFromCookie(dailyCookieName);
    let clicks: string | number = 'X';
    let minutes: string | number = 'X';
    let seconds: string | number = 'X';
    if (dailyGame && JSON.stringify(today) === JSON.stringify(dailyGame.date)){
        clicks = dailyGame.clicks;
        minutes = dailyGame.playTime.minutes;
        seconds = dailyGame.playTime.seconds;
    }
    const textToCopy: string = `WikiHunt - ${dateFormatter(today)}` + (dailyGame ? `
🏁: ${startEnd.start} ➡️ ${startEnd.end}
🖱️: ${clicks} clicks
🕐: ${minutes} minutes ${seconds} seconds` : `
No Records!`);

    navigator.clipboard.writeText(textToCopy);
} 