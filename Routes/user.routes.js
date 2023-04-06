const express = require("express");
const { UserModel } = require("../Model/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { name, email, pass } = req.body;
  try {
    if (name === "" || email === "" || pass === "") {
      res.send({ msg: "Please Enter all details" });
    } else {
      const user = await UserModel.find({ email });
      if (user.length > 0) {
        res.send({ msg: "User already exists with the given email" });
      } else {
        bcrypt.hash(pass, 5, async function (err, hash) {
          // Store hash in your password DB.
          if (err) {
            res.send({ msg: "Something went wrong", error: err.message });
          } else {
            const newUser = new UserModel({ name, email, pass: hash });
            await newUser.save();
            res.send({ msg: "New User Registered" });
          }
        });
      }
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  try {
    if (email === "" || pass === "") {
      res.send({ msg: "Please Enter all the details" });
    } else {
      const user = await UserModel.find({ email });
      if (user.length > 0) {
        bcrypt.compare(pass, user[0].pass).then(function (result) {
          // result == true
          if (result) {
            const token = jwt.sign({ userID: user[0]._id }, "masai");
            res.send({ msg: "Login Successful", token: token });
          } else {
            res.send({ msg: "Invalid Credentials" });
          }
        });
      } else {
        res.send({ msg: "No user found Please Register" });
      }
    }
  } catch (err) {
    res.send({ msg: "Something went wrong", error: err.message });
  }
});

module.exports = { userRouter };
