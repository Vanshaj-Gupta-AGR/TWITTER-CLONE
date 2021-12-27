const User=require('../models/user')



module.exports.profile=async function(req,res){

var user2=await User.findById(req.params.id);

    return res.render('profile',{
        title: "users-profile",
        layout: "layout3",
        id: req.params.id,
        user1: user2
        
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

     req.flash('error',"password not matched")
     
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log(err); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log(err); return}

                req.flash('success','Register Successfully')
                return res.redirect('/users/sign-in');
            })
        }else{
            req.flash("error","User already exist")
            return res.redirect('back');
        }

    });
}


module.exports.createSession = function(req, res){
    req.flash('success','Logged in Successfully')
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','You have logged out')

    return res.redirect('/users/sign-in');
}

module.exports.reply=function (req,res){
    
}

module.exports.following=async function (res,res){
    
}