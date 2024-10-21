const express=require("express");
const cors=require("cors");
require("dotenv").config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app=express();
const port=process.env.port || 5000;

app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER)
// ${process.env.DB_USER}
// ${process.env.DB_SECRET}
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_SECRET}@test1.rgboj.mongodb.net/?retryWrites=true&w=majority&appName=test1`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const userCollection=client.db("bootCampdbFull").collection("users");
     // add user regi data
    app.post("/users",async(req,res)=>{
        const users=req.body;
        console.log(users);
        const result=await userCollection.insertOne(users);
        res.send(result);
    })
    // get user list
    app.get("/users",async(req,res)=>{
        const query=userCollection.find();
        console.log(query);
        const result=await query.toArray();
        res.send(result);
    })
    // get user by id
    app.get("/users/:uid",async (req,res)=>{
        const uid=req.params.uid;
        const query={uid:uid}
        const result= await userCollection.findOne(query);
        res.send(result);
    }

    )

    
    // Update user by id
    app.put("/users/:id", async (req, res) => {
        const id = req.params.id;
        const user = req.body;
        const filter = { _id: new ObjectId(id) };
        const option = { upsert: true };
        console.log(user);
        const updatedUser = {
          $set: {
            displayName: user.displayName,
            email: user.email,
            phone: user.phone,
            photoUrl: user.photoUrl,
            address: user.address,
            isAdmin: user.isAdmin,
            isBlocked: user.isBlocked,
          },
        };
  
        const result = await userCollection.updateOne(
          filter,
          updatedUser,
          option
        );
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}
run().catch(console.dir);
app.get("/",(req,res)=>{
    res.send("Bootcamp react node crud is running");
}
);

app.listen(port, ()=>{
    console.log(`Bootcamp react node crud is running on ${port}`);
})