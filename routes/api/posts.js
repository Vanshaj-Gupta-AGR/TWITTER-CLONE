const express=require('express');

const router=express.Router();

const postCreate=require('../../controllers/posts_controller')

router.post('/',postCreate.create)
router.get('/',postCreate.show);
router.get('/:id',postCreate.onlyone)
router.put('/:id/like',postCreate.update);
router.post('/:id/retweet',postCreate.retweet);
router.delete('/:id',postCreate.delete);
router.put('/:id/pin',postCreate.pin);
router.put('/:id/unpin',postCreate.unpin)



module.exports=router;