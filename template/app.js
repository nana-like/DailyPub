var express = require('express');
var path = require('path');
var ejs = require('ejs');
var exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
var fs   = require('fs');
var data = {} // put your data here.


var app = express();
var PORT = 4000;

// app.engine("handlebars", exphbs());
// app.set("view engine", "handlebars");


app.engine('html', ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/app/src/views'));
app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.static(path.join(__dirname, '/app/dist/views')));

// app.use('/static', express.static('public'));


// var template = fs.readFileSync(path.join(__dirname, '/app/src/views/map.ejs'), 'utf-8');
// var html     = ejs.render ( template , data );


app.get("/", (req, res) => {
    // fs.writeFileSync("./app/dist/views/map.html", html, 'utf8');
    // console.log(html);
    res.status(200).render("map");
});

app.listen(PORT, function() {
    console.log(`Example app listening on port ${PORT}!`);
});

