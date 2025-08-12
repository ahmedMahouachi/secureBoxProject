const express = require('express')
const app = express();
const documentRoutes = require('./routes/documentroute')
const path = require('path')

require('dotenv').config();
const { connectDb } = require("./database/db");

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use('/document', documentRoutes)

app.get('/', (req, res) => {
    res.send("Le serveur fonctionne")
})


connectDb(process.env.MONGO_URI)
.then(() => {
    app.listen(3000, () => {
        console.log("Api on http://localhost:3000");
    })
}) 
