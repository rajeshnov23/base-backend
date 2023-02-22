require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoString = process.env.DATABASE_URL;

async function main() {
  await mongoose.connect(mongoString, { useNewUrlParser: true });
}

module.exports = main;
