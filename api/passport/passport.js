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
            //agar yeh naa bhi kare toh kya farak padega ?
            where: {id: id} //*yeh samajh nahi aya id ke ander konsi id daal rahe hai
        }
        //So either require the whole file - then u have to do
        // DatabaseLogin.(models).Users
        //or require just the models - then u can use all the data members of models -
    ).then((user) => {
        console.log('User Deserialize')
        return done(false,user) //*done ke kya parameters hai jismai humne false aur user bheja hai ? error, user
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