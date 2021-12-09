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
       
        // added this to view the error on console as well
        console.log(err);
        return res.redirect('back');
    }
  
}