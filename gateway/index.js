const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { PORT } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/mp3", require("./routes/mp3"));

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
