import { listOfWords } from '../server.js'
import { dailyWords } from '../server.js'

async function getAllWords(collection){

    try{
        const allWordsData = await collection.find({}).toArray();
        //console.log('All Words Data:', allWordsData);
        return allWordsData;
    } catch (error) {
        console.error('Error in getAllWords function:', error);
        throw error;  
    }
}
async function RandomWordPair(collection) {
    const allWordsData = await collection.find({}).toArray();
    const collectionSize = allWordsData.length;

    let startIndex = Math.floor(Math.random() * collectionSize);
    let endIndex = Math.floor(Math.random() * collectionSize);

    // Ensure the start and end indices are different
    while (startIndex === endIndex) {
        endIndex = Math.floor(Math.random() * collectionSize);
    }

    const startWord = allWordsData[startIndex];
    const endWord = allWordsData[endIndex];
    console.log("start word:", startWord, "end", endWord);
    return {
        start: startWord,
        end: endWord
    };
};
async function getDailyWords(collection){

    const dailyWordsData = await collection.find({}).toArray();
    console.log(dailyWordsData);
    return dailyWordsData;
}

async function updateDailyWords(wordPair, collection){
    await collection.deleteMany({});
    await collection.insertMany([wordPair]);
    console.log('Daily Words updated successfully:', wordPair);

}

exports = async function main(){
    const allWordListcollection = context.services.get("Cluster0").db("WikiHunt").collection("newTestTable");
    const  dailyWordsCollection = context.services.get("Cluster0").db("WikiHunt").collection("newTestTable2");

    //getAllWords(collection);

    const wordPair = await RandomWordPair(allWordListcollection);

    await updateDailyWords(wordPair,dailyWordsCollection);

    getDailyWords(dailyWordsCollection);


};



