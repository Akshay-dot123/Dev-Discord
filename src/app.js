const express = require("express");
const { performance } = require("perf_hooks");
const start = performance.now();
const connectionDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors=require("cors")
require("./config/database");
const app = express();
app.use(cors())
app.use(express.json()); // If we dont use this we will get undefined if we log request body
app.use(cookieParser()); // Just like express.json(), you get undefined if we dont use cookies

const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestRouter=require("./routes/requests");
const userRouter=require("./routes/user")
app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);
// app.get("/user", async (req, res) => {
//   const email = req.body.emailId;
//   try {
//     const users = await UserModel.find({ emailId: email });
//     if (users.length === 0) {
//       res.status(404).send("User not Found");
//     } else {
//       res.send(users);
//     }
//   } catch (error) {
//     res.status(400).send("Something went Wrong");
//   }
// });

// app.get("/feed", async (req, res) => {
//   try {
//     const users = await UserModel.find();
//     res.send(users);
//   } catch (error) {
//     res.status(400).send("Something went Wrong");
//   }
// });

// app.delete("/delete", async (req, res) => {
//   const userId = req.body.userId;
//   try {
//     const users = await UserModel.findByIdAndDelete(userId);
//     res.send("User Deleted Successfully");
//   } catch (error) {
//     res.status(400).send("Something went Wrong");
//   }
// });

// app.put("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;
//   // if(req.body.emailId){   // Method-1
//   //   res.status(400).send("Not Allowed to change")
//   // }
//   try {
//     const Allowed_Updates = ["about", "gender", "age", "skills"]; // Method-2
//     const isupdateAllowed = Object.keys(data).every((k) =>
//       Allowed_Updates.includes(k)
//     );
//     if (!isupdateAllowed) {
//       throw new Error("Update not allowed");
//     }
//     if (data?.skills.length > 10) {
//       throw new Error("Skills cant be more than 10");
//     }
//     await UserModel.findByIdAndUpdate({ _id: userId }, data, {
//       runValidators: true,
//     });
//     res.send("User Inserted Successfully");
//   } catch (error) {
//     res.status(400).send("Update Failed " + error);
//   }
// });

connectionDB()
  .then(() => {
    console.log("Connection successful..");
    app.listen(3000, () => {
      console.log("Listen to PORT:3000");
    });
  })
  .catch((err) => {
    console.log("Some Error", err);
  });

const end = performance.now();
const Total_Execution_Time = (end - start) / 1000;
console.log("Executed in", Total_Execution_Time);
