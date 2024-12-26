const express = require("express");
const authRouter = express.Router();
const UserModel=require("../models/user")
const bcrypt = require("bcrypt");
const {ValidateSignUp} = require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    ValidateSignUp(req);
    let { password, firstName, lastName, emailId } = req.body;
    const HashedPassword = await bcrypt.hash(password, 10);
    // const user = new UserModel({  // Method-1 does not store other info which is problem
    //   firstName,
    //   lastName,
    //   emailId,
    //   password:HashedPassword
    // });
    const user = new UserModel({
      ...req.body,
      password: HashedPassword,
      // gender: "female",
    }); // Method-2
    await user.save();
    res.send("User Inserted Successfully");
  } catch (error) {
    res.status(400).send("Error saving user " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await UserModel.findOne({ emailId });
    if (!user) {
      throw new Error("EmailId or password not found");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      // create jwt Token
      const token = await user.getJWT();
      console.log("token is", token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 100 * 360000),
      }); // Add token
      res.send("Login Successful");
    } else {
      throw new Error("EmailId or password not found");
    }
  } catch (error) {
    res.status(400).send("Error saving user " + error.message);
  }
});

authRouter.post("/logout",async (req,res)=>{
res.cookie("token",null,{expires:new Date(Date.now())})
res.send("Logout Successful")
})
module.exports=authRouter;