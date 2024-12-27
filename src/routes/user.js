const express = require("express");
const auth = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const UserModel = require("../models/user");
const userRouter = express.Router();

// Get all accepted connection request for loggedIn user
userRouter.get("/user/requests/received", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]); //controlling what data to be send
    // }).populate("fromUserId","firstName lastName")  // Alterante way
    res.json({
      message: "Data Fecthed Successfully...",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

// Get all accepted connections for loggedIn user
userRouter.get("/user/connections", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstName lastName gender skills")
      .populate("toUserId", "firstName lastName gender skills");
    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
        // }else{
      }
      return row.fromUserId;
    }); // Next level filter
    res.json({ message: "Data Fecthed Successfully...", data });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});

userRouter.get("/feed", auth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; //If u want to limit
    const skip = (page - 1) * limit;

    // Find all connection requests (sent + received)
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Now create set such that all unique connection requests will be stored
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString()),
        hideUsersFromFeed.add(req.toUserId.toString());
    });

    // Now below code will hide displaying who are already in connection request
    const newFeedUsers = await UserModel.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } }, // I think this line not required
      ],
    })
      .select("firstName lastName gender about skills")
      .skip(skip)
      .limit(limit);

    res.json({ message: "Data Fecthed Successfully...", newFeedUsers });
  } catch (error) {
    res.status(400).send("Error:" + error.message);
  }
});
module.exports = userRouter;
