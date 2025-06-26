const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const Post = require("../models/post");
const requireLogin = require("../middleware/requireLogin");

router.get('/profile/:id',requireLogin,(req,res)=>{ //Showing Profile with existing user id
User.find({_id:req.params.id}).then((user)=>{
    Post.find({postedBy:req.params.id}).then((posts)=>{
        res.status(200).json({user,posts})
    }).catch((err)=>{
        console.log(err);
    })
    
})
})

router.put('/follow',requireLogin,(req,res)=>{ //follow a user
    User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},{new:true}).then((user)=>{
        if(user){
            res.status(200).json({msg:"followed successfully"})
        }
        User.findByIdAndUpdate(req.user._id,{$push:{following:req.body.followId}},{new:true}).then((user)=>{
 
        })
    }).catch((err)=>{
        console.log(err);
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{ //unfollow a user..
    User.findByIdAndUpdate(req.body.followId,{$pull:{followers:req.user._id}},{new:true}).then((user)=>{
        if(user){
            res.status(200).json({msg:"unfollowed successfully"})
        }
        User.findByIdAndUpdate(req.user._id,{$pull:{following:req.body.followId}},{new:true}).then(()=>{
         
        })
    }).catch((err)=>{
        console.log(err);
    })
})

module.exports = router;
