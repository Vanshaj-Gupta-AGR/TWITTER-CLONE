const User=require('../models/user');
const Post=require('../models/post_schema')
const Chat=require('../models/chat_schema')
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

   console.log(users)

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

