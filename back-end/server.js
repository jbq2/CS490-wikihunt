import  express  from 'express'
import {MongoClient} from 'mongodb'
const app= express()
import dotenv from 'dotenv' 

dotenv.config();
const connectionString= process.env.DB_STRING

MongoClient.connect(connectionString)
.then(client => {
    console.log('Connected to Database')
    const db= client.db('WikiHunt')
    const wordCollection = db.collection('randomizedwords')

})
.catch(error=> console.error(error))