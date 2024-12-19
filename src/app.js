const express=require("express")
const app=express()

// This will only handle GET call to /user
app.get("/user",()=>{
    res.send({firstName:'Akshay'})
})

app.post("/user",()=>{
    res.send("Data saved successfully")
})

// This will match all HTTP requests
app.use("/hello",(req,res)=>{
    res.send("Hello from server")
})
app.listen(3000,()=>{
    console.log("Listen to PORT:3000");
})