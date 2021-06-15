const express = require("express");
const router = express.Router();
const db = require("../db");


router.post("/Login" , (req, res, next ) => {
    console.log("login page");
    db.executeSql("SELECT * FROM users WHERE name="+"'"+req.body.email+"'"+"AND password="+"'"+req.body.pass+"' AND isactive=1;", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
         
            return res.json(data);
        }
    });
});







module.exports = router;