const express=require('express');

const router=express.Router();

const notification_controller=require('../controllers/notification_controller');

router.get("/",notification_controller.home);
router.get("/getall",notification_controller.getall);
router.put("/:id/mark",notification_controller.mark);
router.put("/mark",notification_controller.markonlyone);




module.exports=router;

