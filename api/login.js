const route = require('express').Router();
//const User = require('../db/model').models.User;
const passport = require('./passport/passport').passport

route.get('/',(req,res) => {
    if(req.user)
    {
        return res.send({user: req.user})
    }
    return res.send({user: undefined, message: 'user not found'})
})

route.post('/',(req,res,next) => {
    passport.authenticate('local',
        {
            username: req.body.username,
            password: req.body.password
        },
        function (err, user, info) {
            if (err) {
                return res.send({user: null, userFound: false})
            }
            if (!user) {
                //user is false
                return res.send({user: null, userFound: false})
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.send({user: user, userFound: true})
            });
        })(req, res, next)
});


exports.route = route