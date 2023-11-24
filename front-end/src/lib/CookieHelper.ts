// import { _ } from "$env/static/private";
import type { DateFormat, Stats, GameCount, CookieCollection } from "../constants/models";

const dailyCookieName: string = `dailyStats`;
const dailyStreakCookieName: string =  'dailyStreak';
const lastPlayedCookieName: string = 'lastPlayed';
const allTimeBestCookieName: string = 'allTimeBestStats';
const expiryDate = new Date();
expiryDate.setFullYear(expiryDate.getFullYear() + 1); // Set cookie to expire in one year

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
    const cookies = document.cookie.split('; ');
    const targetCookie = cookies.find(row => row.startsWith(inputCookie));
    if (targetCookie) {
        const encodedData = targetCookie.split('=')[1];
        const decodedData = decodeURIComponent(encodedData);
        return JSON.parse(decodedData);
    }
}