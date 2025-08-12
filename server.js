const express = require('express')
<<<<<<< HEAD
const app = express();

const {connectDb} = require('./database/db')


=======

const app = express();


require('dotenv').config();
const { connectDb } = require("./database/db");
>>>>>>> dc6558abc886f9f927cb2891626c766f3e28f5c6

app.listen(3000, ()=> {
    console.log('Api on http://localhost:3000')
})

connectDb(process.env.MONGO_URI)
.then(() => {
    app.listen(3000, () => {
        console.log("Api on http://localhost:3000");
    })
})