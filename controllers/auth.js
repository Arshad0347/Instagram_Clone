const express = require("express");
const router = express.Router();
const User = require("../models/auth");
const { SECRETKEY } = require("../keys");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

router.post("/create-a-user", (req, res) => {   //New User Creation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(422).json({ msg: "Please fill all the fields" });
  } else {
    User.findOne({ email: email }).then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ msg: "User already exists" });
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        const user = new User({
          name,
          email,
          password: hashedPassword,
        });
        user.save();
        res.status(200).json({ msg: "user saved successfully" });
      });
    });
  }
});

router.post("/Login", (req, res) => { //Login to Existing User
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ msg: "Please fill all the fields" });
  } else {
    User.findOne({ email: email }).then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ msg: "Invalid email or password" });
      }
      bcrypt.compare(password, savedUser.password).then((doMatch) => {
        const token = jwt.sign({ id: savedUser._id }, SECRETKEY);
        // console.log("token:", token);
        //  res.status(200).json({msg:"SignIn successful",token})
        if (doMatch) {
          res.status(200).json({ msg: "SignIn successful", token });
        } else {
          res.status(422).json({ msg: "Invalid email or password" });
        }
      });
    });
  }
});

router.get("/protected", requireLogin, (req, res) => { //Authorization Check
  res.status(200).json({ msg: "Protected Route" });
});

module.exports = router;
