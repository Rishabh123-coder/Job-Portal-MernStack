const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passportConfig = require("./lib/passportConfig");
const cors = require("cors");
const fs = require("fs");

dotenv.config({ path: './config.env' });

// MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/jobPORTal", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then((res) => console.log("Connected to DB"))
//   .catch((err) => console.log(err));

// initialising directories
if (!fs.existsSync("./public")) {
  fs.mkdirSync("./public");
}
if (!fs.existsSync("./public/resume")) {
  fs.mkdirSync("./public/resume");
}
if (!fs.existsSync("./public/profile")) {
  fs.mkdirSync("./public/profile");
}

const app = express();
const PORT = process.env.PORT || 4444;

app.use(bodyParser.json()); // supPORT json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // supPORT encoded bodies

// Setting up middlewares
app.use(cors());
app.use(express.json());
app.use(passportConfig.initialize());

// Routing
app.use("/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/apiRoutes"));
app.use("/upload", require("./routes/uploadRoutes"));
app.use("/host", require("./routes/downloadRoutes"));

// app.listen(PORT, () => {
//   console.log(`Server started on PORT ${PORT}!`);
// });

const uri = process.env.MONGODB_URI;

if(process.env.NODE_ENV == 'production'){
  app.use(express.static("frontend/build"));
  const path = require('path');
  app.get('*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'client','build','index.html'));
  })
}

mongoose.connect(uri,
    {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(() => {
        app.listen(PORT, () => {
            console.log(`App running on http://localhost:${PORT}`)
        });
    }).catch(err => {
        console.log(err);
    });
