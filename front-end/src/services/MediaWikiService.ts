import { PUBLIC_API_LOCAL_URL } from '$env/static/public';

class MediaWikiService {
    getPageFromApi(title: string): Promise<any> {
        return fetch(`${PUBLIC_API_LOCAL_URL}/mediawiki/page/${title}`).then((response) => response.json());
    }

    getRandomWordsFromApi(): Promise<any> {
        return fetch(`${PUBLIC_API_LOCAL_URL}/mediawiki/randomwords`).then((response) => response.json());
    }

    getDailyWordsFromApi(): Promise<any> {
        return fetch(`${PUBLIC_API_LOCAL_URL}/mediawiki/dailywords`).then((response) => response.json());
    }
}

export const mediaWikiService = new MediaWikiService();