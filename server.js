var express = require('express');
var app = express();

var passport      = require('passport');
var cookieParser  = require('cookie-parser');
var session       = require('express-session');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


require("./assignment/app.js")(app);

app.use(session({
    secret: process.env.SESSION_SECRET || "This is a secret",
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname+'/public/assignment'));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});