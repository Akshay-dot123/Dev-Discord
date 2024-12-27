const express = require("express");
const requestRouter = express.Router();
const auth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  auth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type:" + status });
      }

      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest) {
        return res.json({
          message: "Connection Request already exists..",
        });
      }
      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        status,
        toUserId,
      });

      const data = await connectionRequest.save();
      res.json({
        message: req.user.firstName + " " + status  +" your profile",
        toUserNamed:toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  }
);

requestRouter.post("/request/receive/:status/:toUserId",auth,
  async (req, res) => {
    try {
      const loggedInUser=req.user;
      const { status, toUserId }=req.params;
      const allowedStatus = ["accepted", "rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({ message: "Invalid Status type:" + status });
      }
      const connectionRequest=await ConnectionRequestModel.findOne({
        _id:toUserId, // Already existed Id in connectionRequest table
        toUserId:loggedInUser._id,  // Request sender Id information
        status:"interested" // If ignored now then it cant be accepted again
      })
      // console.log("toUserId=======>",toUserId);
      // console.log("status=======>",status);
      // console.log("loggedInUser=======>",loggedInUser);
      // console.log("connectionRequest============>",connectionRequest);
      
      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection Request not found",
        });
      }
      connectionRequest.status = status;
      const data=await connectionRequest.save();
      res.json({message:"Connection request "+status,data})
    } catch (error) {
      res.status(400).send("Error:" + error.message);
    }
  }
)
module.exports = requestRouter;
