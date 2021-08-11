const passport = require('passport');
const JwtStrategry = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config');
const User = require('../model/user');
const LocalStartegy= require('passport-local');


//create local strategy
const localOptions= {usernameField: 'email'}; 
const localLogin = new LocalStartegy(localOptions, function(email, password, done) {
    //verify the usrname and password
    //correct 
    //call done with false
    User.findOne({email: email}, function(err, user){
        if(err) {return done(err);}
        if(!user) {return done(null, false);}
  
        //compare
        user.comparePassword(password, function(err, isMatch){
            if(err) {return done(err);}

            if(!isMatch) {return done(null, false);}
            return done(null, user);
        })
    });
  
});

const jwtOptions= {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};


const jwtLogin = new JwtStrategry(jwtOptions, function(payload, done) {
    User.findById(payload.sub, function(err, user){
        if(err) {return done(err);}

        if(user) {
            done(null, user);
        }
        else{
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);