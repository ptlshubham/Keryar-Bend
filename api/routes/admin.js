const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require('multer');
const path = require('path');
const helper = require("../../helper");
const config = require("../../config");




router.get("/GetClientList",(req,res,next)=>{
    db.executeSql("SELECT u.uid,u.name,r.rolename FROM users u left join userrole r on u.role = r.id where u.role = 3 ", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
});

router.post("/UpdateClientsDetails", (req, res, next) => {
    console.log(req.body);
    db.executeSql("UPDATE `keryar`.`users` SET name='" + req.body.name + "', role="+req.body.selectedRoleId+" WHERE uid=" + req.body.uid + ";", function (data, err) {
        if (err) {
            console.log("Error in store.js", err);
        } else {
            return res.json(data);
        }
    });
});

router.get("/DeleteClient/:uid",(req,res,next)=>{
    db.executeSql("delete FROM users where uid ="+req.params.uid  , function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
});



router.get("/GetEmployeeList",(req,res,next)=>{
    db.executeSql("SELECT u.uid,u.name,r.rolename FROM users u left join userrole r on u.role = r.id where u.role = 2 ", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.post("/AddNewClient",(req,res,next)=>{
    console.log(req.body);
    db.executeSql("INSERT INTO `users`(`name`, `role`, `isactive`, `password`, `mob`, `email`, `profile_pic`) VALUES('"+req.body.name+"',"+req.body.role+","+req.body.active+",'"+req.body.password+"',"+req.body.mobile+",'"+req.body.email+"','null');" , function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
});
      
router.post("/GetMessage",(req,res,next)=>{
    console.log(req.body);
    if(req.body.sender ==1){
        db.executeSql("select c.id , c.sender ,c.receiver,c.receiver2,c.message,c.createddate,r.name as sendername ,r.name as receivername from chat c left join users r on c.sender = r.uid where c.sender="+req.body.receiver+" OR c.receiver="+req.body.receiver+" ORDER BY createddate " , function(data , err){
            if(err){
                console.log("Error in store.js" ,err);
            }
            else{
               // console.log(data);
                return res.json(data);
            }
        });
    }
    else{
        console.log("other");
        db.executeSql("select * from chat WHERE  (sender='"+req.body.sender+"' OR sender="+req.body.receiver+") AND (receiver="+req.body.receiver+" OR receiver='"+req.body.sender+"' ) ORDER BY createddate " , function(data , err){
            if(err){
                console.log("Error in store.js" ,err);
            }
            else{
               // console.log(data);
                return res.json(data);
            }
        });
    }
       
})

router.post("/UploadGrpImage", (req, res , next) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'upload/groups');
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {
            console.log(file);
            cb(null, req.body.desc  + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage ,fileFilter: helper.imageFilter}).single('image');
    upload(req, res, function(err) {
        console.log(req.body.desc);
        console.log("path=",config.url+'/upload/groups/'+ req.file.filename);
        return res.json( '/upload/groups/'+ req.file.filename);
       console.log("You have uploaded this image");
    });
});

router.post("/UploadTrnsImage", (req, res , next) => {
    const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'upload/Trans');
        },
        // By default, multer removes file extensions so let's add them back
        filename: function(req, file, cb) {
            console.log(file);
            cb(null, req.body.desc  + path.extname(file.originalname));
        }
    });
    let upload = multer({ storage: storage, fileFilter: helper.imageFilter }).single('image');
    upload(req, res, function(err) {
        console.log("path=",config.url+'/upload/Trans/'+ req.file.filename);
        return res.json( '/upload/Trans/'+ req.file.filename);
       
    });
});
router.post("/AddNewTaskClient",(req,res,next)=>{
    db.executeSql("INSERT INTO `task`(start_date`, `title`, `description`, `deadline`, `notes`, `image`, `client`, `employee`, `status`, `completed_date`, `apr_admin`, `apr_client`, `ref_link`) VALUES("+req.body.startdate+","+"'"+req.body.title+"'"+",'"+req.body.desc+"',"+req.body.deadline+","+req.body.notes+","+req.body.img+","+req.body.client+","+req.body.emp+","+req.body.status+","+req.body.comp_date+","+req.body.apr_admin+","+req.body.apr_client+",'"+req.body.ref_link+"');SELECT TOP 1   * FROM tb_users ORDER BY CreatedDate DESC;", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
});

router.post("/AddUsers",(req,res,next)=>{
    db.executeSql("INSERT INTO `users`(start_date`, `title`, `description`, `deadline`, `notes`, `image`, `client`, `employee`, `status`, `completed_date`, `apr_admin`, `apr_client`, `ref_link`) VALUES("+req.body.startdate+","+"'"+req.body.title+"'"+",'"+req.body.desc+"',"+req.body.deadline+","+req.body.notes+","+req.body.img+","+req.body.client+","+req.body.emp+","+req.body.status+","+req.body.comp_date+","+req.body.apr_admin+","+req.body.apr_client+",'"+req.body.ref_link+"');SELECT TOP 1   * FROM tb_users ORDER BY CreatedDate DESC;", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.post("/UpdateBalance",(req,res,next)=>{
    db.executeSql("UPDATE tb_groups SET G_T="+req.body.G_T+",C_B="+req.body.C_B+" where ID='"+req.body.ID+"';", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data) ;
        }
    })
})


module.exports = router;