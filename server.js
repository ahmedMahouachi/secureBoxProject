const express = require('express')
const app = express();

const {connectDb} = require('./database/db')



app.listen(3000, ()=> {
    console.log('Api on http://localhost:3000')
})

connectDb(process.env.MONGO_URI)
.then(() => {
    app.listen(3000, () => {
        console.log("Api on http://localhost:3000");
    })
})