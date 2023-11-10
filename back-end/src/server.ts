import { MongoClient } from 'mongodb';
import dotenv from 'dotenv' ;

dotenv.config();
const connectionString= process.env.DB_STRING;
let wordCollection;

MongoClient.connect(connectionString)
    .then(client => {
        console.log('Connected to Database');
        const db= client.db('WikiHunt');
        wordCollection = db.collection('randomizedwords');
    })
    .catch(error=> console.error('DB CONNECTION FAILED', error));
export { wordCollection }; 