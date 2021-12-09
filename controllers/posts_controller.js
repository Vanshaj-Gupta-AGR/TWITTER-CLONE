module.exports.create=function(req,res){
    if(!req.body.content){
        console.log('content params is not sent')
        return res.sendStatus(400);
    }

}