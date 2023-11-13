import moment from 'moment'
import 'moment-timezone'
import { listOfWords } from '../server.js';
import { dailyWords } from '../server.js';

class Daily {
    checkTime(): void {
        var timeInEst = moment.tz("America/New_York"); // Get time in EST
        if (timeInEst.hour() === 23 && timeInEst.minute() === 59) { // check for 11:59 PM
            this.setDailyWords();
        }
        // console.log(timeInEst.hour(), timeInEst.minute());
    }

    async getRandomTwoWords(): Promise<string[]> { // Gets random words from database
        let start = await this.getWord();
        let end = await this.getWord();
        while (start[0] == end[0] || start[1] == end[1]) {
            end = await this.getWord();
        }
        return [start[0], end[0]];
    }

    async getWord(): Promise<string[]> {
        try {
            let wordCount = await listOfWords.countDocuments(); 
            // console.log("wordCount:", wordCount);
            let idx = Math.floor(Math.random() * wordCount);
            // console.log("idx:", idx);
            let results = await listOfWords.findOne({ index: idx })
            if (results) {
                let word = results.word; // set startWord based on obtained index
                let category = results.category; // set startCategory based on startWord
                return [word, category]
            } else {
                throw new Error("Error getting word");
            }
        } catch (error) {
            console.error("Error getting word:", error);
            throw error; 
        }
    }

    async setDailyWords(): Promise<void> { // Sets Daily words in the document, calls getRandomTwoWords
        let words = await this.getRandomTwoWords();
        await dailyWords.updateOne(
            {},
            { $set: { start: words[0], end: words[1] } },
            { upsert: true }
        );
    }

    async getDailyWords(): Promise<string[]> { // Retrieves Daily words in the document, called when playing daily game
        let words = await dailyWords.find({});
        let startWord = words.start;
        let endWord = words.end;
        return [startWord, endWord];
    }

}

export const daily = new Daily();