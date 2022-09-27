const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const expressLayouts = require('express-ejs-layouts');
const studentRoute = require('./routes/student');


// environment variables
dotenv.config();
const PORT = process.env.PORT || 4000;

// init express
const app = express();

// data manage
app.use(express.json());
app.use(express.urlencoded( { extended : false } ));

// init ejs
app.set("view engine", "ejs");
app.set("layout", "layouts/app");
app.use( expressLayouts );

// static folder
app.use( express.static('public') );

// routes
app.use( '/student', studentRoute );



// server listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${ PORT }`.bgGreen.black);
});

