const express = require("express");
const app = express();
const cors = require("cors");
// const route = require("./routes/ROUTES");
// const db = require("./config/connectDB");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

//Connect to database
// db.connect();

//Run json in request.http
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Enable cors
app.use(cors());

//Routes init
// route(app);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
