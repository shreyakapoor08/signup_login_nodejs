const express = require('express');
const config = require('./config.json');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

const cookieParser = require('cookie-parser');
const passport = require('./api/passport/passport').passport;
const session = require('express-session');


const routes = {
    signup: require('./api/signup').route,
    login: require('./api/login').route
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/',express.static(path.join(__dirname,'public_static')));
app.use(session({secret: 'Passport Login'}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
    proxy: true,
    saveUninitialized: true
}));

app.use('/signup',routes.signup);
app.use('/login',routes.login);


app.listen(config.SERVER.PORT, () => {
    console.log('Server started at http://localhost:' + config.SERVER.PORT);
});