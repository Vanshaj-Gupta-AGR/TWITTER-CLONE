const express=require('express');

const router=express.Router();

const passport = require('passport');

const homeController=require('../controllers/home_controler')

router.get('/',passport.checkAuthentication,homeController.home)
router.use('/users',require('./users'))
router.use('/api/posts',require('../routes/api/posts'));
module.exports=router;
