const route = require('express').Router();
const LoginDatabase = require('../db/model').models.User;
const PasswordDatabase = require('../db/model').models.Passwords;
const bcrypt = require('bcrypt');
const saltRounds = 10;

route.get('/',(req,res) => {
    //if user is already logged in
    LoginDatabase.findAll()
        .then((results)=>{
            return res.send(results);
        }).catch((err)=> console.error('ERROR IN FINDING ALL USERS '+err))

});

//adding a new user
route.post('/',(req,res) => {
    LoginDatabase.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        course: req.body.course,

    },{returning: true}).then((result) => {

       //*signuppass ko kahi define nahi kara toh ismai kya ayega?
            PasswordDatabase.create({
                password:req.body.signuppass,
                usernameId: result.id
            }).then(()=> {console.log('User Added');
                return res.send({userAdded:true,message: "User Added Successfully"})})
                .catch((err)=> console.error('Password'+err))
        })
    }).catch((err)=> console.error('Cannot add user' + err))

exports = module.exports = {
    route
};