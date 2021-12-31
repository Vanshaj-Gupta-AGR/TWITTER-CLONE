const User=require('../models/user');
const uuid=require('uuid-random');
const nodemailer = require('nodemailer');
const nodeMailer = require('../config/nodemailer');
module.exports.one=function(req,res){
    res.status(200).render('requestReset',{
        title: "password reset",
        layout: "layout2",
        statusMessage: ""


    })
}

module.exports.two=async function(req,res){
    if(!req.body)
    return

const payload = req.body
const findEmail = req.body.resetEmail.trim()

const getUser = await User.findOne({email: findEmail})
.catch(() => {
   
    return res.status(400).render("requestReset", {
        statusMessage : "Something went wrong. Please try again.",
        title: "password reset",
        layout: "layout2"
    })
})

if(getUser == null) {
        return res.status(400).render("requestReset", {
            statusMessage : "No user found. Please use the email address you used when registering your account",
            title: "password reset",
            layout: "layout2"
        })
    }


else {

    const checkForField = await User.updateOne({email: findEmail}, [{$set:{"resetPassword": { $cond: [ { $not: ["$resetPassword"] }, "", "$resetPassword" ]}}}])
    .catch(() => {
        return res.status(400).render("requestReset", {
            statusMessage : "Something went wrong. Please try again.",
            title: "password reset",
            layout: "layout2"
        })
    })

    const checkForPreviousReset = await User.findOne({email: findEmail}).select("resetPassword")
    .catch(() => {
        return res.status(400).render("requestReset", {
            statusMessage : "Something went wrong. Please try again.",
            title: "password reset",
            layout: "layout2"
        })
    })

    if(checkForPreviousReset.resetPassword !== "") {
    
        return res.status(400).render("requestReset", {
            statusMessage : "You have already requested a password change. Please check your inbox",
            title: "password reset",
            layout: "layout2"
        })
    }

    const uniqueId = uuid()

    const updateUser = await User.findOneAndUpdate({email: findEmail}, {resetPassword: uniqueId})
    .catch(() => {
        return res.status(400).render("requestReset", {
            statusMessage : "Something went wrong. Please try again.",
            title: "password reset",
            layout: "layout2"
        })
    })

    
    let htmlString=`You have requested a password change. 
    <p>Please follow this link to change your password:</p>
    <a href="https://secret-plateau-80086.herokuapp.com/request/passwordReset?id=${uniqueId}">Click here</a>
    <br><br>If you don't see the link, please copy and paste this line in your browser's address bar:
    <p>https://secret-plateau-80086.herokuapp.com/request/passwordReset?id=${uniqueId}</p>`

    nodeMailer.transporter.sendMail({
       from: 'twitter Clone',
       to:  findEmail,
       subject: "password change!",
       html: htmlString
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message sent', info);
         
    return res.status(400).render("requestReset", {
        statusMessage : "We have sent you an email with a link to reset your password. If you don't see it in your inbox, please check your spam folder",
        title: "password reset",
        layout: "layout2"
    })
    });
    


 
   

}
}

module.exports.three=async function (req,res){
    if(Object.keys(req.query).length === 0){
        return res.status(400).render("passwordReset",{
            title: "password reset",
            statusMessage: "Broken link",
            layout: "layout2"
        })
        
    }
    const id = req.query.id
 
    const getUser = await User.findOne({resetPassword: {$regex: id}}).select("id firstName")
    .catch(() => {
            return res.status(400).render("passwordReset",{
                title: "password reset",
                statusMessage: "Something went wrong. Please try again.",
                layout: "layout2"
            })
        })
    
 
    if(getUser == null) {
        return res.status(400).render("passwordReset",{
            title: "password reset",
            statusMessage: "Something went wrong. Please try again.",
            layout: "layout2"
    })
}
    else {
       return res.status(400).render("passwordReset",{
            title: "password reset",
            name: getUser.name,
            layout: "layout2",
            statusMessage: ""
    })
}

}

module.exports.four=async function (req,res){
    const payload = req.body
    const password = req.body.password
    const confirmPass = req.body.confirmPassword
 
    const id = req.query.id
 
    const getUser = await User.findOne({resetPassword: {$regex: id}}).select("id firstName")
    .catch(() => {
        return res.status(400).render("passwordReset",{
            title: "password reset",
            statusMessage: "Something went wrong. Please try again.",
            layout: "layout2"
    })
})
 
    if(getUser == null) {
        return res.status(400).render("passwordReset",{
            title: "password reset",
            statusMessage: "Broken link",
            layout: "layout2"
        })
       
    }
    else {
         payload.name = getUser.firstName
        if(password !== confirmPass) {
            return res.status(400).render("passwordReset",{
                title: "password reset",
                statusMessage: "please enter the same password in both fields",
                layout: "layout2"
        })
        }
        else {
            const newPassword = password
            const changePass = await User.findByIdAndUpdate(getUser._id, {password: newPassword})
            .catch(() => {
                return res.status(400).render("passwordReset",{
                    title: "password reset",
                    statusMessage: "Something went wrong. Please try again.",
                    layout: "layout2"
            })
            })
            const removeRequest = await User.findByIdAndUpdate(getUser._id, {resetPassword: ""})
            .catch(() => {
                return res.status(400).render("passwordReset",{
                    title: "password reset",
                    statusMessage: "Something went wrong. Please try again.",
                    layout: "layout2"
            })
            })
 
            return res.status(400).render("passwordReset",{
                title: "password reset",
                statusMessage: "Password succesfully updated!",
                layout: "layout2"
        })
        }       
    }
}
