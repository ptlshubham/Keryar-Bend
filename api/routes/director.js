const express = require("express");
const router = express.Router();
const db = require("../db");




router.get("/GetGrpApprovalList/:uid" , (req, res, next ) => {
    console.log(req.params.uid);
    db.executeSql("SELECT * FROM tb_groups where APPROVER="+req.params.uid+"  AND STATUS=0 order by CR_DATE desc", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
});

router.get("/GetPendingTrnsList/:uid" , (req,res,next)=>{
    db.executeSql("SELECT * FROM tb_transaction where APPROVER="+req.params.uid +" AND STATUS=0 order by CR_DATE desc", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.post("/ApproveTransaction" , (req,res,next)=>{
    db.executeSql("UPDATE  tb_transaction SET STATUS=1, APR_DATE=CURRENT_TIMESTAMP , COMMENT='"+req.body.COMMENT+"' where ID ="+req.body.ID , function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.post("/ApproveGroup" , (req,res,next)=>{
    db.executeSql("UPDATE  tb_groups SET STATUS=1, APR_DATE=CURRENT_TIMESTAMP, COMMENT='"+req.body.COMMENT+"' where ID ='"+req.body.ID +"'", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})
router.get("/GetPendingGrpListUser/:uid",(req,res,next)=>{
    console.log("prnv here");
    console.log(req.params.uid);
    db.executeSql("SELECT * FROM tb_groups WHERE CREATOR="+req.params.uid+" AND STATUS=0 order by CR_DATE desc", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.get("/GetPendingTrnsListUser/:uid",(req,res,next)=>{
    db.executeSql("SELECT * FROM tb_transaction WHERE CREATOR="+req.params.uid+" AND STATUS=0 order by CR_DATE desc", function(data , err){
        if(err){
            console.log("Error in store.js" ,err);
        }
        else{
            return res.json(data);
        }
    });
})

router.get("/GetRecentGroups/:uid",(req,res,next)=>{
    db.executeSql("Select  TYPE from tb_users  WHERE UID="+req.params.uid,function(data, err){
        if(err)
        {
            console.log("Error in store.js" ,err);
        }
        else
        {
            if(data[0].TYPE==3){
                db.executeSql("SELECT * FROM tb_groups WHERE APPROVER="+req.params.uid+" ORDER BY CR_DATE desc", function(data1 , err){
                    if(err)
                    {
                        console.log("Error in store.js" ,err);
                    }
                    else
                    {
                        return res.json(data1); 
                    }
                });
            }
            else{
                db.executeSql("SELECT * FROM tb_groups WHERE CREATOR="+req.params.uid+" ORDER BY CR_DATE desc", function(data1 , err){
                    if(err)
                    {
                        console.log("Error in store.js" ,err);
                    }
                    else
                    {
                        return res.json(data1); 
                    }
                });
            }
        }
    });
                    
})

router.get("/GetRecentTransaction/:uid",(req,res,next)=>{
    db.executeSql("Select  TYPE from tb_users  WHERE UID="+req.params.uid,function(data, err){
        if(err)
        {
            console.log("Error in store.js" ,err);
        }
        else
        {
            console.log("role=",data);
            if(data[0].TYPE == 3)
            {
                db.executeSql("SELECT * FROM tb_transaction WHERE APPROVER="+req.params.uid+" order by CR_DATE desc", function(data , err){
                    if(err)
                    {
                        console.log("Error in store.js" ,err);
                    }
                    else
                    {
                        return res.json(data);
                    }
                    
                });
            }
            else
            {
                db.executeSql("SELECT * FROM tb_transaction WHERE CREATOR="+req.params.uid+" order by CR_DATE desc", function(data, err){
                    if(err)
                    {
                        console.log("Error in store.js" ,err);
                    }
                    else
                    {
                        return res.json(data);
                    }
                })
            }
        }
    })
})
var parent='';
var child='';
router.get("/GetDirectory/:gid" , (req,res,next)=>{
  //  console.log("u r here");
    parent='';
    child='';
    getParent(req.params.gid);
    let i=0;
     function getParent(grpId){
        parent='';
        child='';
      //  console.log("id here",grpId);
        db.executeSql("SELECT PARENT,NAME FROM tb_groups WHERE ID="+grpId,function(data,err){
            if(err){
                console.log("Error in store.js" ,err);
            }
            else{
               // console.log(data.recordset[0]);
              // console.log("JHDJHSDJFHJDSH",data[0].NAME);
                if(data[0].PARENT == 0){
                    parent =  data[0].NAME +'/'+ child;
                    console.log("parent",parent);
                    return  res.json(parent);
                }
                else{
                    child= data[0].NAME +'/'+child;
                    getParent(data[0].PARENT);
                }
            }
        })
    }
    
   // return res.json(parent);
})





module.exports = router;