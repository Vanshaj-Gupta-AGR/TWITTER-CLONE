const express=require('express');

const router=express.Router();

const postCreate=require('../../controllers/posts_controller')

router.post('/',postCreate.create)


module.exports=router;