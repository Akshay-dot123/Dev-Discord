const adminAuth = (req, res, next) => {
  let token = "abc";
  let AdminAuth = token === "abc";
  if (!AdminAuth) {
    res.status(401).send("Unauthorized");
  } else {
    next();
  }
};
module.exports = adminAuth