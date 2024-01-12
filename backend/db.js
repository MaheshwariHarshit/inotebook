const mongoose = require('mongoose')
const mongoURI = 'mongodb://localhost:27017/inotebook'

const connectToMongo = ()=> {
    try {
        mongoose.set('strictQuery', false)
        mongoose.connect(mongoURI) 
        console.log('Mongo connected')
    }
    catch(error) {
        console.log("Coundn't start server")
        console.log(error)
        process.exit()
    }
}

module.exports = connectToMongo