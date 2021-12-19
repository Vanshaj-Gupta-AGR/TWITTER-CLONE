const express=require('express');

const router=express.Router();

const messageController=require('../controllers/message_controller');

router.get('/',messageController.message);
router.get('/new',messageController.new_message);
router.post('/chat',messageController.chat);



module.exports=router;