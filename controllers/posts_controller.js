const User=require('../models/user');
const Post=require('../models/post_schema')

module.exports.create = async function(req, res){
    try{

        var postData={
            content: req.body.content,
            user: req.user._id
        }

        if(req.body.replyTo){
            postData.replyTo= req.body.replyTo;
        }

        let post = await Post.create(postData);
        
        if (req.xhr){
       
            post=await User.populate(post,{path: "user"});

          return res.status(201).send(post)
        }

       
       

    }catch(err){
       
      
        console.log(err);
        return res.redirect('back');
    }
  
}
module.exports.show=  function(req,res){
    Post.find()
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


module.exports.update=async function(req,res){
    try{
    
     
     var islike=req.user.likes && req.user.likes.includes(req.params.id);

     var option =islike ? "$pull" : "$addToSet"

     req.user=await   User.findByIdAndUpdate(req.user._id,{[option]: {likes: req.params.id}},{new: true});
        
     
     var post=await  Post.findByIdAndUpdate(req.params.id,{[option]: {likes: req.user._id}},{new: true});

     return res.status(200).send(post)
     




    }catch(err){
        console.log(err);

    }



}

module.exports.retweet=async function(req,res){

    try{
         
        var deletedPost=await Post.findOneAndDelete({user: req.user._id,retweetData: req.params.id});



     
       
   
        var option =deletedPost!=null ? "$pull" : "$addToSet"

        var repost=deletedPost;

        if(repost==null){
            repost=await Post.create({
                user: req.user._id,
                retweetData: req.params.id

            })
        }
   
         req.user=await  User.findByIdAndUpdate(req.user._id,{[option]: {retweet: repost._id}},{new: true});
           
        
        var post=await  Post.findByIdAndUpdate(req.params.id,{[option]: {retweetUsers: req.user._id}},{new: true});
   
        return res.status(200).send(post)
        
   
   
   
   
       }catch(err){
           console.log(err);
   
       }
   
   

}


module.exports.onlyone=async function(req,res){
    await Post.findById(req.params.id)
    .populate("user")
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


module.exports.delete=async function(req,res){
    await Post.findByIdAndDelete(req.params.id)

    return res.sendStatus(202);

}

module.exports.postbyid=async function(req,res){
    await Post.find({user: req.params.id})
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