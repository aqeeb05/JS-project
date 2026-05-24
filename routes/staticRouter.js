const express = require("express");
const URL=require('../models/url.model.js')

const router = express.Router();

router.get('/', async(req,res)=>{
    const allurls= await URL.find({});
    return res.render("home",{
        urls:allurls,
    });
});

router.get('/dsignup',(req,res)=>{
    return res.render("signup");
});

module.exports= router;