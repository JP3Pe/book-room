const express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    expressValidator = require('express-validator'),
    passport = require('passport'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

const config = require('./config');

const port = process.env.PORT || 8008;
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://root:example@mongo:27017', error => {
        if (error) throw error;
    }
);

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(expressValidator());

app.use(session({
    secret: config.secret,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/', (req, res) => res.send('Welcome to the "BOOK ROOM" API'));

require('./passport/local')(passport);

require('./authRouter')(app, passport);

const roomRouter = require('./roomRouter');
app.use('/api/rooms', roomRouter);

const meetingRouter = require('./meetingRouter');
app.use('/api/meetings', meetingRouter);

const bookingRouter = require('./bookingRouter');
app.use('/api/bookings', bookingRouter);

app.listen(port, '0.0.0.0', () => console.log(`Server running on PORT: ${port}`));
