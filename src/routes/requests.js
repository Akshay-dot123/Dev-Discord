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
        message: req.user.firstName + " " + status + " your profile",
        data,
      });
    } catch (err) {
      res.status(400).send("Error:" + err.message);
    }
  }
);
module.exports = requestRouter;
