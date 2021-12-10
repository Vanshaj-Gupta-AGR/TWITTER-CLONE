const express=require('express');

const router=express.Router();

const postCreate=require('../../controllers/posts_controller')

router.post('/',postCreate.create)
router.get('/',postCreate.show);
router.put('/:id/like',postCreate.update);



module.exports=router;