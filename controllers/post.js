const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const Post = require("../models/post");

router.post("/create-post", requireLogin, (req, res) => { //Post Creation
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

router.get("/all-post", requireLogin, (req, res) => { //All Post Showing
  Post.find().then((posts) => {
    return res.status(200).json({ posts });
  });
});

router.get("/show-mypost", requireLogin, (req, res) => { //Showing Own Post
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myposts) => {
      res.json({ myposts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like-post", requireLogin, async (req, res) => { //Like a Post
  try {
    const { postId } = req.body;

    // Input validation
    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    // Check if user already liked the post
    // const post = await Post.findById(postId);
    // if (post.likes.includes(req.user._id)) {
    //   return res.status(400).json({ error: "You already liked this post" });
    // }

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

router.put("/unlike-post", requireLogin, async (req, res) => { //Dislike a Post
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

router.put('/comment-post',requireLogin,async(req,res)=>{ //addition of comment
  try {
    const {postId,text}=req.body;
    const updatedPost=await Post.findByIdAndUpdate(postId,
      {
        $push:{comment:{text,postedBy:req.user._id,}}
      },
      {
        new:true
      }
    )
    console.log(updatedPost);
    
    res.json(updatedPost)
  } catch (error) {
    console.log(error);
  }
})

router.delete("/delete-post/:postId", requireLogin, (req, res) => { //delete a post
  Post.findOne({ _id: req.params.postId })
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (post.postedBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
      }
      Post.deleteOne({ _id: req.params.postId })
        .then(() => {
          res.json({ message: "Post deleted successfully" });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: "Failed to delete post" });
        });
    })
});


module.exports = router;
