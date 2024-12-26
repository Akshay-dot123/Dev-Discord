const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const adminAuth = async (req, res, next) => {
  // Read token from req cookies
  try {
    const { token } = req.cookies;
    if (!token) {
      // validate token
      throw new Error("Invalid Token !!!!");
    }
    const decodedObj = await jwt.verify(token, "Secret_Key");
    const { _id } = decodedObj;
    // Find the user
    const user =await UserModel.findById(_id);
    if (!user) {
      throw new Error("User Does not exists");
    }
    req.user=user  // Attaching user to req handler,so that other API can access user Info
    next();
  } catch (err) {
    res.status(400).send("Error:" + err.message);
  }
};

// const adminAuth = (req, res, next) => {  // static token code
//   let token = "abc";
//   let AdminAuth = token === "abc";
//   if (!AdminAuth) {
//     res.status(401).send("Unauthorized");
//   } else {
//     next();
//   }
// };
module.exports = adminAuth;
