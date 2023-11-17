export type StartEndApiResponse = {
    start: string,
    end: string
};

export type PageApiResponse = {
    title: string,
    html: string
};

export type FinalTime = {
    minutes: number,
    seconds: number
};

export type DateFormat = {
    month: number,
    day: number,
    year: number
};

export type Stats = {
    date: DateFormat,
    goal: object,
    playTime: FinalTime,
    clicks: number,
    winPath: string[]
};

export type GameCount = {
    count: number
};

export type CookieCollection = {
    dailyStats: Stats,
    allTimeBest: Stats,
    dailyStreak: GameCount,
    lastPlayed: DateFormat
};
