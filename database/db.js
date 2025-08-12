const mongoose = require('mongoose');

async function connectDb(uri) {
    if (!uri) {
        throw Error('MONGOURI manquant')
    }
    await mongoose.connect(uri)
    
    console.log('databse connected', mongoose.connection.host);
    
    mongoose.connection.on('error', (err) => {
        console.error('mongo error', err.message);
        
    })
}

module.exports = {connectDb};