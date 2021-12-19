const path=require('path');
const User=require('../models/user');
const Post=require('../models/post_schema')
const Chat=require('../models/chat_schema')
module.exports.home=function(req,res){
   return res.render('home',{
       title: "Home"
   })
}

module.exports.image=function (req,res){
    res.sendFile(path.join(__dirname,'../uploads/images/' + req.params.path))
}

module.exports.temp1=async function(req,res){
    
    var content1={ $regex: req.body.obj, $options: "i"};

    await Post.find({content:content1})
    .populate("user")
    .populate({
        path: 'replyTo',
        populate: {path: 'user'}
    })
    
    .populate({
        path: 'retweetData',
        populate: {path: 'user'}
    })
    
    .sort({"createdAt": -1})
    .then(results=> res.status(200).send(results))
    .catch(error =>{
        console.log(error);
    })

   

}
module.exports.temp=async function(req,res){


     var content1={ $regex: req.body.obj, $options: "i"};

     var user=await User.find({name:content1})
     .populate("_id")
     

     
     
    
    
    .then(results=> res.status(200).send({
        result: results,
        user: req.user
    }))
    .catch(error =>{
        console.log(error);
    })


}


module.exports.temp3=function(req,res){
   
    Chat.find({users:{ "$in": req.user._id } })
    .populate("users")
    .sort({updatedAt:-1})
    .then(results=>res.status(200).send({
        results: results,
        userlog: req.user
    }))
    .catch(error=>{
        console.log(error);
        res.sendStatus(400);
    })
}


