const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../keys');
const requireLogin = require('../middleware/requireLogin')

router.get('/protected', requireLogin, (req, res)=>{
  res.send("hello user")
})

router.post('/signup',(req, res)=>{
  const {name, userName, email, password} = req.body;
  if(!name || !userName || !email || !password) {
    return res.status(422).json({error: "Please add all field"})
  }
  User.findOne({ $or: [{ email: email}, { userName: userName}]})
  .then((savedUser)=>{
    if(savedUser) {
      return res.status(422).json({error: "User Already Exists"})
    }
    bcrypt.hash(password,12)
    .then(hashedpassword=>{
      const user = new User({
        name,
        userName,
        email,
        password:hashedpassword
      })
      user.save()
      .then((user)=>{
        res.status(200).json({msg: "User Added Successfully"})
      })
      .catch(err=>{
        console.log(err);
      })
    })
  })
  .catch(err=>{
    console.log(err);
  })
})

router.post('/signin',(req, res)=>{
  const {email, password} = req.body;
  if(!email || !password) {
    return res.status(422).json({error: "Please add all field"})
  }
  User.findOne({email: email})
  .then(savedUser=>{
    if(!savedUser) {
      return res.status(422).json({error: "Invalid Email or Password"})
    }
    bcrypt.compare(password,savedUser.password)
    .then(doMatch=>{
      if(doMatch) {
        // return res.status(200).json({msg: "Successfully Login"})
        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
        return res.json(token)
      }
      return res.status(422).json({error: "Invalid Email or Password"})
    })
    .catch(err=>{
      console.log(err);
    })
  })
  .catch(err=>{
    console.log(err);
  })
})

module.exports = router