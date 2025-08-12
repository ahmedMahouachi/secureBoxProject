const mongoose = require('mongoose');
async function connectDb(url) {
    if (!url){
        throw Error('MONGOURI manquant')
    }
    await console.log('database connected',mongoose.connection.host);
    mongoose.connection.on('error',(err)=>{
        consoleerror('mongo error',err.message);
    })
}
module.exports = {connectDb};