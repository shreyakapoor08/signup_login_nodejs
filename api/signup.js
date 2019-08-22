const route = require('express').Router();
const LoginDatabase = require('../db/model').models.User;
const PasswordDatabase = require('../db/model').models.Passwords;
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 10;

route.get('/',(req,res) => {
    //if user is already logged in
    if(req.user)
    {
        return res.send({message: 'Logged In'})
    }
    return res.sendFile(path.join(__dirname,'../public_static/index.html'))
});

//adding a new user
route.post('/',(req,res) => {
    LoginDatabase.create({
        id: req.body.id,
        username: req.body.username,
        email: req.body.email,
        course: req.body.course
    },{returning: true}).then((result) => {
        bcrypt.hash(req.body.signuppass,saltRounds,(err,hash)=>{
            PasswordDatabase.create({
                password:hash,
                usernameId: result.id
            }).then(()=> {console.log('User Added');
                return res.send({userAdded:true,message: "User Added Successfully"})})
                .catch((err)=> console.error('Password'+err))
        })
    }).catch((err)=> console.error('Cannot add user' + err))

});

exports = module.exports = {
    route
};