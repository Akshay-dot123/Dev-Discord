const express = require("express");
const app = express();
const adminAuth = require("./middlewares/auth");
// Middleware
app.use("/admin", adminAuth);

app.get("/talk", (req, res) => {
  throw new Error("No error .");
});

app.get("/admin/user", (req, res) => {
  res.send("User data sent");
});

app.get("/manager", (req, res) => {
  res.send("Manager data sent");
});

// Try to keep this piece of code lastly which handles error if not handled...
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("This will handle any above error if you dont use try-catch.........");
  }
});

// Multiple Route Handler
app.use(
  "/route",
  (req, res, next) => {
    console.log("Handling route 1");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 2");
    res.send("2nd response !!");
    next();
  },
  (req, res, next) => {
    console.log("Handling route 2");
    // res.send("2nd response !!");
  }
);

// Regex
app.get("/abc(de)?d", (req, res) => {
  res.send({ firstName: "Akshay" });
});
// This will only handle GET call to /user
app.get("/*user$/", (req, res) => {
  res.send({ firstName: "Akshay" });
});

app.post("/user", (req, res) => {
  res.send("Data saved successfully");
});

// This will match all HTTP requests like Get, Post and all
app.use("/hello", (req, res) => {
  res.send("Hello from server");
});
app.listen(3000, () => {
  console.log("Listen to PORT:3000");
});
