const User=require('../models/user');
const Post=require('../models/post_schema')

module.exports.create = async function(req, res){
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        
        if (req.xhr){
       
            post=await User.populate(post,{path: "user"});

          return res.status(201).send(post)
        }

       
       

    }catch(err){
       
      
        console.log(err);
        return res.redirect('back');
    }
  
}

module.exports.show= async function(req,res){
    try{
        let post=await Post.find();
     

        post=await User.populate(post,{path: "user"});

        if(post){
            return res.status(200).send(post);
        }


    }
    catch(err){
        console.log(err);
    }
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