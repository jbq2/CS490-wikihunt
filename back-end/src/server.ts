import { MongoClient } from 'mongodb';
import dotenv from 'dotenv' ;

dotenv.config();
const connectionString= process.env.DB_STRING;
let wordCollection;
let allWordList;
let dailyWords;
let client;
let db;


const connectToDatabase = async () => {
    try {
        client = await MongoClient.connect(connectionString);
        console.log('Connected to Database');
        db = client.db('WikiHunt');
        //wordCollection = db.collection('randomizedwords');
        allWordList = db.collection('newTestTable');
        dailyWords = db.collection('newTestTable2');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1); // Exit the process with an error code
    }
};

export {connectToDatabase};
export { wordCollection }; 
export { allWordList }; 
export { dailyWords }; 

