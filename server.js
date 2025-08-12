const express = require("express");
const authRoutes = require('./routes/authRoutes');
const app = express();
const path = require('path');

require('dotenv').config();
const { connectDb } = require("./database/db");

// config
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/api/auth', authRoutes);
app.get('/', (_, res) => {
  res.status(200).send('Serveur marche correctement.');
});

// connection et démarrage
connectDb(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log("Api on http://localhost:3000");
  });
});
