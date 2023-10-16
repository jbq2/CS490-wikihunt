class MediaWikiService {
    getPagePromise(pageTitle: string): Promise<any> {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&origin=*&page=${pageTitle}&prop=text`;
        return fetch(apiUrl)
            .then((response) => {
                return response.json();
            })
            .catch((error) => { // errors
                console.error("Error fetching Wikipedia content:", error);
            });
    }

    getStartEndWords(): Promise<string[]> {
        // This response grabs 2 random wikipedia pages and this function will access the titles of these pages
        const getWordsUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&rnnamespace=0&list=random&formatversion=2&rnlimit=2`;
        return fetch(getWordsUrl)
            .then((response) => { // get response
                return response.json();
            })
            .then((response) => {
                const startAndEnd = <[]>response.query.random.map((page: any) => page['title']) // makes an array that contains the titles from each given page (in this case there are 2 pages returned)
                return startAndEnd;
            })
            .catch((error) => {
                console.error("Error fetching Wikipedia pages:", error);
                throw error;
            });
            
    }
}

export const mediaWikiService = new MediaWikiService();