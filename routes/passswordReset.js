const express=require('express');

const router=express.Router();

const passwordController=require('../controllers/password_controller')

router.get("/v",passwordController.one);
router.post('/v',passwordController.two)
router.get('/passwordReset',passwordController.three)
router.post('/passwordReset',passwordController.four)




module.exports=router