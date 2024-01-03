const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const { PORT, MONGO_URI } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));

mongoose.connect(MONGO_URI);
mongoose.connection.once("open", () =>
  console.log("Connected to database successfully")
);

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
