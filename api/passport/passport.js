const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const databaselogin = require('../../db/model')
const sequelize = require('sequelize')
const bcrypt = require('bcrypt')


//serialize user
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

//de-serialize user
passport.deserializeUser(function(id, done) {
    dblogin.User.findAll(
        {
            where: {id: id}
        }
    ).then((user) => {
        console.log('User Desserialize')
        return done(false,user)
    }).catch((err) => console.error(err))
});

passport.use(new LocalStrategy({
    username: 'username',
    password: 'password'
}, function(username,password,done) {
        databaselogin.User.findOne({
            username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));