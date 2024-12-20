const express = require("express");
const connectionDB = require("./config/database");
const UserModel = require("./models/user");
require("./config/database");
const app = express();
app.use(express.json())  // If we dont use this we will get undefined if we log request body

app.post("/signup", async (req, res) => {
const user=new UserModel(req.body);
  // const user = new UserModel({
  //   firstName: "Akshay",
  //   lastName: "Prabhu",
  //   name:"Aksau",
  //   emailId: "akshay@gmail.com",
  //   password: "asdsad"
  // });
  try {
    await user.save();
    res.send("User Inserted Successfully");
  } catch (error) {
    console.log(error);
  }
});

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
