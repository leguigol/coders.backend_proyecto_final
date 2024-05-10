const { Router }=require('express');

const userModel=require('../dao/model/user.model');
const { createHash, isValidPasswd }=require("../utils/encrypt");
const { generateJWT,SECRET_JWT }=require('../utils/jwt')
const passport=require('passport');
const handlePolicies = require('../middleware/handle-policies.middleware');
const userCtrl=require('../controller/user.controller');

const router=Router();

router.post ('/login',userCtrl.getUserByEmail);

router.post('/register',userCtrl.registerUser);

router.get('/current',handlePolicies("USER") ,userCtrl.getCurrentUser);

module.exports=router;