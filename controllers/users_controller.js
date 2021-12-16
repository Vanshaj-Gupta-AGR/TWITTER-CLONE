const User=require('../models/user')



module.exports.profile=function(req,res){
    return res.render('profile',{
        title: "users-profile",
        layout: "layout3",
        id: req.params.id,
        bol: true
    })
}

module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('user_sign_up', {
        title: "Twitter | Sign Up",
        layout: "layout2"
    })
}



module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Twitter | Sign In",
        layout: "layout2"
    })
}


module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){

        console.log('chutiya')
     
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log(err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log(err); return}

                return res.redirect('/users/sign-in');
            })
        }else{
            return res.redirect('back');
        }

    });
}


module.exports.createSession = function(req, res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();


    return res.redirect('/');
}

module.exports.reply=function (req,res){
    
}