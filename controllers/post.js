const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");

router.post("/create-post", requireLogin, (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  const post = new Post({
    title,
    body,
    photos: pic,
    postedBy: req.user,
  });
  post.save().then(() => {
    return res.status(201).json({
      msg: "Post add successfully",
    });
  });
});

router.get("/all-post", requireLogin, (req, res) => {
  Post.find().then((posts) => {
    return res.status(200).json({ posts });
  });
});

router.get("/show-mypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like-post", requireLogin, async (req, res) => {
  try {
    const { postId } = req.body;

    // Input validation
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if user already liked the post
    const post = await Post.findById(postId);
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/unlike-post", requireLogin, async (req, res) => {
  try {
    const { postId } = req.body;

    // Input validation
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if user already liked the post
    const post = await Post.findById(postId);
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ error: "You have not liked this post" });
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: req.user._id },
      },
      {
        new: true,
      }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}); 

router.post('/comment',requireLogin,(res,req)=>{
    const {text,postId}=req.body;
    if(!text || !postId){
        return res.status(422).json({error:"Please add all the fields"});
    }
    const comment={
        text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(postId,{$push:{comment:comment}},{$new:true})
    .then((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})



module.exports = router;
