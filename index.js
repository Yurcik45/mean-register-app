const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const path = require("path");
const configDB = require("./config/db");
const account = require("./routes/account");

// const PORT = process.env.PORT || 8080;
const PORT = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/account', account);
app.use(passport.initialize());
app.use(passport.session());

require("./config/passport")(passport)

mongoose.connect(configDB.db, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('_-_ Connected to mongoDB _-_');
});
mongoose.connection.on('error', (err) => {
    console.log('___ NOT!!! connected to mongoDB ___' + err);
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res) => {
    res.send('Home page');
});




app.listen(PORT, () => {
    console.log('---- Server has been started on PORT -- ' + PORT + ' --')
})