
const express = require('express')
const app = express();
const documentRoutes = require('./routes/documentroute')
const path = require('path')
require('dotenv').config();
const { connectDb } = require("./database/db");
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



app.get('/', (req, res) => {
    res.send("Le serveur fonctionne")
})

// routes
app.use('/api/auth', authRoutes);
app.use('/api/files', documentRoutes)
app.get('/', (_, res) => {
  res.status(200).send('Serveur marche correctement.');
});


connectDb(process.env.MONGO_URI)
.then(() => {
    app.listen(3000, () => {
        console.log("Api on http://localhost:3000");
    })
}) 


