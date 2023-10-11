class MediaWikiService {
    getPagePromise(pageTitle: string) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${pageTitle}&prop=text`;
        return fetch(apiUrl);
    }
}

export const mediaWikiService = new MediaWikiService();