let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/free-shortener', {useNewUrlParser: true});

let express = require('express');
let bodyParser = require('body-parser');
let routes = require('./app/config/routes');
let session = require('express-session');
let cookieParser = require('cookie-parser');
let pageNotFound = require('./app/middlewares/pageNotFound');
let selectedLanguage = require('./app/middlewares/selectedLanguage');
let flash = require('./app/middlewares/flash');
let setLocals = require('./app/middlewares/setLocals');
let app = express();

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser('_secret_'));
app.use(session({secret: '_secret_', cookie: { maxAge: 60 * 60 * 1000 }, saveUninitialized: false, resave: false}));
app.use(selectedLanguage);
app.use(flash);
app.use(setLocals);


app.use('/', routes);
app.use(pageNotFound);

app.listen(3000, () => console.log('Server listening on port 3000...'));