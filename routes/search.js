const express=require('express');

const router=express.Router();

const searchController=require('../controllers/searchcontroller');

router.get('/',searchController.searchpage)
router.get('/:selected',searchController.tabs);

module.exports=router;