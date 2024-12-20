const mongoose = require("mongoose");

const connectionDB = async () => {
  await mongoose.connect(
    "mongodb+srv://akshaytest234:75hiWCRmMDb31dgx@cluster0.usgz9.mongodb.net/HelloWorld"
  );
};
module.exports=connectionDB;
