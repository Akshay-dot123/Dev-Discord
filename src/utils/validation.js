const validator = require("validator");
const ValidateSignUp = (req) => {
  let { password } = req.body;
  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a Strong password..");
  }
};

const validateEditProfile = (req) => {
  const Allowed_Updates = [
    "firstName",
    "lastName",
    "about",
    "gender",
    "age",
    "skills",
  ];
  const isEditAllowed = Object.keys(req.body).every((field) =>
    Allowed_Updates.includes(field)
  );
  return isEditAllowed;
};
module.exports = { ValidateSignUp, validateEditProfile };
