import { PUBLIC_API_LOCAL_URL } from '$env/static/public';

class MediaWikiService {
    getPageFromApi(title: string): Promise<any> {
        return fetch(`${PUBLIC_API_LOCAL_URL}/mediawiki/page/${title}`).then((response) => response.json());
    }

    getWordsFromApi(): Promise<any> {
        return fetch(`${PUBLIC_API_LOCAL_URL}/mediawiki/startend`).then((response) => response.json());
    }
}

export const mediaWikiService = new MediaWikiService();