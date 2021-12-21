const express=require('express');

const router=express.Router();

const messageController=require('../controllers/message_controller');

router.get('/',messageController.message);
router.get('/new',messageController.new_message);
router.post('/chat',messageController.chat);
router.get("/:id",messageController.chatting)
router.put('/chatname/:id',messageController.chatname);
router.get('/chatname/:id',messageController.getchatname);
router.get('/chatname/:id/message',messageController.getmessages);
router.post('/message',messageController.sendmessage);



module.exports=router;