import { MongoClient } from 'mongodb';
import dotenv from 'dotenv' ;

dotenv.config();
const connectionString= process.env.DB_STRING;
let wordCollection;
let listOfWords;
let dailyWords;

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database');
        const db= client.db('WikiHunt');
        wordCollection = db.collection('randomizedwords');
        listOfWords = db.collection('allwords');
        dailyWords = db.collection('dailypair');

    })
    .catch(error=> console.error(error));
export { wordCollection }; 
export { listOfWords }; 
export { dailyWords }; 

