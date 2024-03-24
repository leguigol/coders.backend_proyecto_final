const { Router }=require('express');

const router=Router();

router.get(`/`, (req, res) => {
    console.log("INFO DE LAS COOKIES", req.cookies, req.signedCookies);
  
    return res.json({ cookie: req.cookies, signedCookies: req.signedCookies });
});

module.exports=router;