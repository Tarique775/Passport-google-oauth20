require('dotenv').config();
const express = require('express');
const expressSession = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');

const app = express();

// set view engine
app.set('view engine', 'ejs');

// set up session cookies
app.use(
    expressSession({
        secret: [keys.session.cookieKey],
        cookie: {
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            httpOnly: true,
        },
        resave: false,
        saveUninitialized: false,
    }),
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
// connect to mongodb

const mongoDBConnect = async () => {
    try {
        const mongooseConnect = await mongoose.connect(keys.mongodb.dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
        });
        if (mongooseConnect) {
            return console.log('Database Conected Successfully!');
        }
    } catch (err) {
        throw new Error(err);
    }
};
mongoDBConnect();

// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route
app.get('/', (req, res) => {
    res.render('home', { user: req.user });
});
app.use((req, res, next) => {
    res.status(404).json({ message: 'not found!' });
    next();
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err) {
        return res.status(500).json({ message: err.message });
        // console.log(chalk.red.inverse(err.message));
    }
    return res.status(500).json({ message: 'there was a requesting error!' });
    // console.log(chalk.red.inverse('there was a requesting error!'));
});
app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});
