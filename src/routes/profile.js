const express = require("express");
const profileRouter = express.Router();
const auth = require("../middlewares/auth");
const { validateEditProfile } = require("../utils/validation");
const {ValidateSignUp} = require("../utils/validation");
const bcrypt = require("bcrypt");
profileRouter.get("/profile/view", auth, async (req, res) => {
  try {
    const user = req.user;
    res.send(req.user);
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});
profileRouter.put("/profile/edit", auth, async (req, res) => {
  try {
    if (!validateEditProfile(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedUser[key] = req.body[key]));
    await loggedUser.save();
    res.json({
      message: `${loggedUser.firstName}, your profile updated successfully`,
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
});

profileRouter.put("/profile/password", auth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const { oldPassword, password } = req.body;
    const isPasswordValid = await loggedUser.validatePassword(oldPassword);
    if (isPasswordValid) {
      ValidateSignUp(req); // Strong password Validator
      const HashedPassword = await bcrypt.hash(password, 10);
      loggedUser.password=HashedPassword
      await loggedUser.save();
      res.send("User password successsfully updated")
    } else {
      throw new Error("Password is Incorrect");
    }
  } catch (error) {
    res.status(400).send("Error saving user " + error.message);
  }
});

module.exports = profileRouter;
