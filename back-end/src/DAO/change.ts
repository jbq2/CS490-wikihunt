import { connectToDatabase, allWordList } from '../server.js'
import { dailyWords } from '../server.js'

async function getAllWords(){

    try{
        const allWordsData = await allWordList.find({}).toArray();
        //console.log('All Words Data:', allWordsData);
        return allWordsData;
    } catch (error) {
        console.error('Error in getAllWords function:', error);
        throw error;  
    }
}
async function RandomWordPair(){
    const collectionSize = await allWordList.countDocuments();

    let startIndex = Math.floor(Math.random() * collectionSize);
    let endIndex = Math.floor(Math.random() * collectionSize);

    // Ensure the start and end indices are different
    while (startIndex === endIndex) {
        endIndex = Math.floor(Math.random() * collectionSize);
    }

    const startWord = await allWordList.findOne({}, { skip: startIndex });
    const endWord = await allWordList.findOne({}, { skip: endIndex });
    console.log("start word:", startWord, "end", endWord)
    return {
        start: startWord,
        end: endWord
    };
}

async function getDailyWords(){

    const dailyWordsData = await dailyWords.find({}).toArray();
    console.log(dailyWordsData);
    return dailyWordsData;
}

async function updateDailyWords(wordPair){
    await dailyWords.deleteMany({});
    await dailyWords.insertMany([wordPair]);
    console.log('Daily Words updated successfully:', wordPair);

}

async function main(){
    await connectToDatabase();

    getAllWords();

    const wordPair = await RandomWordPair();
    getDailyWords();

    await updateDailyWords(wordPair);

    getDailyWords();


}

main();

