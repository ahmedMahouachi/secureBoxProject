const express = require("express");

const app = express();

app.use(express.json());
const adminRoute = require('./routes/adminRoute');

require('dotenv').config();
const { connectDb } = require("./database/db");

connectDb(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log("Api on http://localhost:3000");
  });
});

//Route pour accéder aux routes admin (./routes/adminRoute)
app.use('/history', adminRoute);
