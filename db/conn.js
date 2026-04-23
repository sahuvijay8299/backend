const mongoose = require("mongoose")

const DB_URL = process.env.DATABASE;

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Mongo db connection established successfully...");
  })
  .catch((error) => {
    console.log(`Error in establishing connection ${error}`);
  });