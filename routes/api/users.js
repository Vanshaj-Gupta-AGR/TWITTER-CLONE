const express=require('express');

const router=express.Router();

const postCreate=require('../../controllers/posts_controller')

router.get("/:id",postCreate.postbyid);

module.exports=router
