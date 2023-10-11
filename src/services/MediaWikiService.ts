class MediaWikiService {
    getPagePromise(pageTitle: string) {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${pageTitle}&prop=text`;
        return fetch(apiUrl)
            .then((response) => {
                return response.json();
            })
            .catch((error) => { // errors
                console.error("Error fetching Wikipedia content:", error);
            });
    }
}

export const mediaWikiService = new MediaWikiService();