const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User", // reference to the user collection
      required:true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required:true
    },
    status: {
      type: String,
      required:true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: `{VALUE} is incorrect`,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index 
connectionRequestSchema.index({fromUserId:1, toUserId:1});

// Before saving data in DB
connectionRequestSchema.pre("save",function(next){
  const connectionRequest=this;
  if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
    throw new Error("Cannot send connection request to yourself !!!")
  }
  next()
})

const ConnectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequestModel;