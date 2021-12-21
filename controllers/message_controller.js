const User=require('../models/user');
const Post=require('../models/post_schema')
const Chat=require('../models/chat_schema')
const Message=require('../models/message_schema')
const mongoose=require('mongoose');
module.exports.message=function (req,res){
        res.status(200).render('message',{
            title: "Inbox",
            layout: "layout4",
        })

}

module.exports.new_message=function (req,res){
    res.status(200).render('new_message',{
        title: "New Message"
    })

}

module.exports.chat=function(req,res){
   if(!req.body.users){
       return res.sendStatus(400);
   }

   var users=JSON.parse(req.body.users);

  

   if(users.length==0){
    return res.sendStatus(400);
}

    users.push(req.user);

    var chatData={
        users: users,
        isGroupChat: true
    }
    Chat.create(chatData)
    .then(results=>{
        res.status(200).send(results)
    }).catch(err=>{
        console.log(err);
        res.sendStatus(400);
    })
}

module.exports.chatting=async function(req,res){
    var user=req.user._id;
    var chatid=req.params.id;

    var chat=await Chat.findOne({_id: chatid, users: { "$in": user }})
    .populate("users");

    if(chat==null){
        var userFound=await User.findById(chatid);

        if(userFound!=null){
            chat=await getChatByUserId(userFound._id,user);
        }
    }

    res.status(200).render('chat',{
        title: "Chat",
        layout: "layout3",
        chat: chat
        
    })
}

function getChatByUserId(userLoggedInId,otherUserId){
    return Chat.findOneAndUpdate({
        isGroupChat: false,
        users:{
            $size: 2,
            $all: [
                {$elemMatch: {$eq: mongoose.Types.ObjectId(userLoggedInId)}},
                {$elemMatch: {$eq: mongoose.Types.ObjectId(otherUserId)}},

            ]
        }
    },
    {
        $setOnInsert: {
            users: [userLoggedInId,otherUserId]
        }
    },{
        new: true,
        upsert: true
    })
    .populate('users');
}

module.exports.chatname= function(req,res){
    Chat.findByIdAndUpdate(req.params.id, { chatName: req.body.chatName })
    .populate('users')
    .then((result)=>{
        return res.status(200).send({
            chat: result,
            userlog: req.user
        });
    })
   
}
module.exports.getchatname= function(req,res){
    Chat.find({_id: req.params.id})
    .populate('users')
    .then((result)=>{
        return res.status(200).send({
            chat: result,
            userlog: req.user
        });
    })
   
   
}

module.exports.sendmessage= function (req,res){
   
    var newMessage={
        sender: req.user._id,
        content: req.body.content,
        chat: req.body.chatId
    }

    Message.create(newMessage)
    .then(async result=>{
        result=await result.populate("sender")
        result=await result.populate("chat")

        var chat=await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage: result});

        

        return res.status(200).send({
            message: result,
            userlog: req.user
        });
    })
   
}

module.exports.getmessages= async function(req,res){
    Message.find({chat: req.params.id})
    .populate("sender")
    .populate("readBy")
    .then((result)=>{
        return res.status(200).send({
            messages: result,
            userlog: req.user
        });
    })

    
   
   
}

