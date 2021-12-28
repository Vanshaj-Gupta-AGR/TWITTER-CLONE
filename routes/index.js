const express=require('express');

const router=express.Router();

const passport = require('passport');

const homeController=require('../controllers/home_controler');



router.get('/',passport.checkAuthentication,homeController.home)
router.use('/messages',require('./messages'));
router.use('/users',require('./users'))
router.use('/api/posts',require('../routes/api/posts'));
router.use('/api/users',require('../routes/api/users'));
router.get('/uploads/images/:path',homeController.image)
router.use('/search',require('./search'));
router.post("/api/us/sr",homeController.temp)
router.post("/api/ps/sr",homeController.temp1)
router.post("/old/oops",homeController.temp3);
router.use('/notifications',require('./notificatons'));
router.get('/u',homeController.vansh);






module.exports=router;
