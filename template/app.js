var express = require('express');
var path = require('path');
var ejs = require('ejs');
var exphbs = require("express-handlebars");

var app = express();
var PORT = 4000;

// app.engine("handlebars", exphbs());
// app.set("view engine", "handlebars");


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app/src'));
app.engine('html', ejs.renderFile);

app.get("/", (req, res) => {
    res.status(200).render("index");
});

app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`);
});

