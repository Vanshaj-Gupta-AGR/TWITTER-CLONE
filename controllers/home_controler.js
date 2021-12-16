const path=require('path');
module.exports.home=function(req,res){
   return res.render('home',{
       title: "Home"
   })
}

module.exports.image=function (req,res){
    res.sendFile(path.join(__dirname,'../uploads/images/' + req.params.path))
}