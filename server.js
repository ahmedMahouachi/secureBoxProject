const express = require("express");

const app = express();

require('dotenv').config();
const { connectDb } = require("./database/db");

connectDb(process.env.MONGO_URI).then(() => {
  app.listen(3000, () => {
    console.log("Api on http://localhost:3000");
  });
});

