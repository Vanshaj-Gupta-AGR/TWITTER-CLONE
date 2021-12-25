const Notification=require('../models/notification_schema')

module.exports.home=function (req,res){
    return res.status(200).render('notifications',{
        title: "Notifications",
        layout: 'layout5'
    })
}

module.exports.getall=function(req,res){


var searchObj= {userTo: req.user._id,notificationType: {$ne: "newMessage"}};

if(req.query.unreadOnly!==undefined && req.query.unreadOnly=="true"){
    searchObj.opened=false;
}


   Notification.find(searchObj)
   .populate("userTo")
   .populate("userFrom")
   .sort({createdAt: -1})
   .then(results=>{
       res.status(200).send(results)
   })
}
module.exports.mark=function(req,res){
    Notification.findByIdAndUpdate(req.params.id,{opened: true})
    .then(results=>{
        return res.status(200).send(results)
    })
 }

 module.exports.markonlyone=function(req,res){
    Notification.updateMany({userTo: req.user._id}, {opened: true})
    .then(results=>{
        return res.status(200).send(results)
    })
 }

 module.exports.latest=function(req,res){
       Notification.findOne({userTo: req.user._id})
       .populate("userTo")
       .populate("userFrom")
       .sort({createdAt: -1})
       .then(results=>{
           res.status(200).send(results)
       })

 }