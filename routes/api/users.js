const express=require('express');
const multer=require("multer");
const upload=multer({dest: "uploads/"})

const router=express.Router();

const postCreate=require('../../controllers/posts_controller')

router.get("/:id",postCreate.postbyid);
router.put("/:id/follow",postCreate.one);
router.post('/upload',upload.single("croppedImage"),postCreate.image)
router.post('/upload/cover',upload.single("croppedImage"),postCreate.cover)


module.exports=router
