const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const DatabaseLogin = require('../../db/model').models.User;
const PasswordLogin = require('../../db/model').models.Passwords;
const Bcrypt = require('bcrypt');

//serialize user
passport.serializeUser(function(user, done) {
    console.log('Serialize user')
    done(null, user.id);
});

//de-serialize user
passport.deserializeUser(function(id, done) {
    DatabaseLogin.findAll(
        {
            where: {id: id}
        }
    ).then((user) => {
        console.log('User Deserialize')
        return done(false,user)
    }).catch((err) => console.error(err))
});


//not understood
passport.use(new LocalStrategy({
    username: 'username',
    password: 'password'
}, function (username,password,done) {
    DatabaseLogin.findOne({
        where: {username: username}
    }).then((result)=>{

        if(result == undefined)
        {
            return done(null,false,{message:"Invalid Username"})
        }
        PasswordLogin.findOne({
            where:{usernameId:result.id}
        }).then((result2)=>{
            console.log("password Table ---")
            console.log(result2)
            console.log("password")
            console.log(password);

            Bcrypt.compare(password,result2.password,(err,result_bcrypt)=>{ // ????????
                if(err)
                {
                    return done(null,false,{message:'Error'})
                }
                if(!result_bcrypt)
                {
                    return done(null,false,{message:'Invalid Password'})
                }
                return done(null,result,{message:'User Found'})
            })

        }).catch((err)=>{
            console.error(err);
            return done(err,false)
        })
    }).catch((err)=>{
        console.error(err);
        return done(err,false)
    })
}));

exports = module.exports = {
    passport
};