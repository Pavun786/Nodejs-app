const express = require("express");
const cors = require("cors");
const app = express();

//Driver in nodejs
const mongodb = require("mongodb");

//we give request to database by this client 
const mongoClient = mongodb.MongoClient;

//here we connect the mongodb by protocal of mongodb
const URL ="mongodb://localhost:27017";
const DB = "B41";

//let users=[{"id":1,"name":"person1","age":10},{"id":2,"name":"person2","age":11},{"id":3,"name":"person3","age":12}];
// let users=[]

//this is midleware,it act as mediator like get request & after execute required function 
app.use(express.json())

//here we write a middleware for avoiding CORS-poilcy error when react connect with nodejs.& we also install this packages
app.use(cors({
    origin:"http://localhost:3000"
}))

app.get("/home",function(req,res){
    res.json({message: "welcome"})
})
app.get("/about",function(req,res){
    res.json([{
        name:"pavun",
        age:"26"
    },
    {
        name:"Guna",
        age:"25"
    },
    {
        name:"Kavin",
        age:"26"
    }
    ])
})

app.post("/user", async function(req,res){
    // req.body.id = users.length+1
    // users.push(req.body)
    // res.json({message:"User Created Successfully"})
    
   try{
     
     // step-1: create a connection between nodejs & mongodb
    const connection = await mongoClient.connect(URL)

    //step-2:select the db
    const db = connection.db(DB)
 
    //step-3:select the collection
    //step-4:Do the operation (CURD)
 
    await db.collection("users").insertOne(req.body)
 
    //step-5:close the connection
    await connection.close()
 
    res.json({message:"Data inserted"})
   }catch(error){
    console.log(error)
     res.status(500).json({message : "Something went wrong"})
   }
})

app.get("/users",function(req,res){
   let qParms =req.query
   console.log(qParms)
   
   let resUser =[]
   for(let index=parseInt(req.query.offset);index < parseInt(req.query.offset)+ parseInt(req.query.limit);index++){
   if(users[index]){ 
    resUser.push(users[index])
   }
}
    res.json(resUser);
})

app.get("/user/:id",function(req,res){
    
    //it's id value get from url by params.and its stored in userId variable.
    let userId = req.params.id;
    //here find methoed use to check & find the object still condition passing.
    let user = users.find((item)=>item.id == userId)
    if(user){
        res.json(user)
    }else{
        res.json({message:"user not found"})
    }
})
//-------------------- Edit methoed
app.put("/user/:id",function(req,res){
    let userId=req.params.id;
   
    // this findIndex methoed is used to find the index of obj,which one condition passing
    
    let userIndex=users.findIndex((item)=> item.id == userId);
    //obj.keys()methoed collect the keys from  editting object
    Object.keys(req.body).forEach((item)=>{
        users[userIndex][item] = req.body[item];
    })
    res.json({
        message:"Done"
    });
})
//------Delete Methoed-----
app.delete("/user/:id",function(req,res){
    let userId = req.params.id;
    let userIndex = users.findIndex((item)=> item.id == userId);
    if(userIndex != -1){
    users.splice(userIndex,1);
    res.json({
        message:"User deleted"
    })
} else{
    message:"User not found"
}
})

app.listen(process.env.PORT || 3001)
