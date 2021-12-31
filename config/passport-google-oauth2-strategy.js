const passport=require('passport');
const googlestrategy=require('passport-google-oauth').OAuth2Strategy;
const crypto=require('crypto');
const User=require('../models/user');




passport.use(new googlestrategy({
    clientID: "479595391274-rpubadnma6ovkkcejsamfs2pudcg3dti.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "https://secret-plateau-80086.herokuapp.com/users/auth/google/callback",
   },
   function(accessToken,refreshToken,profile,done){
        User.findOne({email: profile.emails[0].value}).exec(function(err,user){
            if(err){
                console.log("error in google",err);
                return ;
            }

          

            if(user){
                return done(null,user);
            }
            else{
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                },function(err,user){
                    if(err){
                        console.log(err);
                    }

                    return done(null,user);
                })
            }
        })
   }
))


module.exports=passport;