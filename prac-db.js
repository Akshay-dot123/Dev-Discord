// const { MongoClient } = require("mongodb");
// const url =
//   "mongodb+srv://akshaytest234:75hiWCRmMDb31dgx@cluster0.usgz9.mongodb.net/";
// const client = new MongoClient(url);
// const dbName = "HelloWorld";

// const data = {
//   "first Name": "Akshay",
//   "last Name": "Prabhu",
// };

// async function main() {
//   await client.connect();
//   console.log("Connected successfully to server");
//   const db = client.db(dbName);
//   const collection = db.collection("User");
//   const insertResult = await collection.insertMany([data]);
//   console.log("Inserted documents =>", insertResult);
//   //   const findResult = await collection.find({}).toArray();
//   //   console.log("Found documents =>", findResult);
//   //   const countData=await collection.countDocuments({})
//   //   console.log("countData documents =>", countData);
//   //   const result = await collection.find({ "first Name": "Akshay" }).count();
//   //   console.log("result documents =>",result);
//   return "done.";
// }

// main()
//   .then(console.log)
//   .catch(console.error)
//   .finally(() => client.close());

// 
function x() {
  let a=90;
  function j() {
    console.log("function j===========>",a);
}
a=34;
return j;
}
// var a=x();
// console.log(a);
// a()