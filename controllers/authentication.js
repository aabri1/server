const Users = require('../model/user');
const jwt = require('jwt-simple');
const config = require('../config');


function tokenForUser(user) {
    const timeStamp = new Date().getTime();
    return jwt.encode({sub: user.id, iat: timeStamp}, config.secret);
}


exports.signin = function(req, res, next) {
    res.send({token: tokenForUser(req.user)});
}


exports.signup = function(req, res, next ) {

    //see if the user with email exist 
    const email = req.body.email;
    const password = req.body.password;


    //validate if email and password was sent
    //validate if the email is the valid email
    if(!email || !password) {
        return res.status(422).send({error: 'Email or Password is required'});
    }

    Users.findOne({email: email}, function(err, exisitingUser) {
        if(err) {
            return next(err);
        }
        
        if (exisitingUser) {
            return res.status(422).send({error: 'Email already exist'});
        }

        const newUser = new Users({
            email: email,
            password: password
        });
        
        newUser.save(function(err){
            if(err) {
                return next(err);
            }

            res.json({token: tokenForUser(newUser)});
        });
    });

    // email does  exist return an error

    //email does not exist - create one

    //respond 


}