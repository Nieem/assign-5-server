const express=require("express");
const cors=require("cors");
require("dotenv").config()
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app=express();
const port=process.env.port || 5000;

app.use(cors());
app.use(express.json());

app.use(cors({
  origin: 'https://assign-5-server.onrender.com',
  credentials: true
}));

//console.log(process.env.DB_USER)
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
    const userCollection1=client.db("bootCampdbFull").collection("categories");
    const userCollection2=client.db("bootCampdbFull").collection("products");
    const userCollection3=client.db("bootCampdbFull").collection("userBuyproducts");
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
     // res.send("yes users");
    })
    // get user by id
    app.get("/users/:uid",async (req,res)=>{
        const uid=req.params.uid;
        const query={uid:uid};
        console.log(query);
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
           // email: user.email,
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


      //add category

 app.post("/category",async(req,res)=>{
  const categories=req.body;
  const result=await userCollection1.insertOne(categories);
  res.send(result);
 })

  //fetch category
  app.get("/category",async(req,res)=>{
    const query=userCollection1.find();
    console.log(query);
    const result=await query.toArray();
    res.send(result);
   })

   //fetch category by id
  app.get("/category/:id",async(req,res)=>{
    const id=req.params.id;
    const query={_id:new ObjectId(id)};
    const result= await userCollection1.findOne(query);
    //console.log(id);
    res.send(result);
   })

// update category by id
   app.put("/category/:id", async (req, res) => {
    const id = req.params.id;
    const category = req.body;
    const filter = { _id: new ObjectId(id) };
    const option = { upsert: true };
    console.log(category);
    const updatedCategory = {
      $set: {
        name: category.name,
        image: category.image
       
      },
    };

    const result = await userCollection1.updateOne(
      filter,
      updatedCategory,
      option
    );
    res.send(result);
  });

// delete category
app.delete("/category/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result= await userCollection1.deleteOne(query);
  console.log(query);
  res.send(result);
 // res.send("yes users");
})
//add products
app.post("/products",async(req,res)=>{
  const products=req.body;
  console.log(products);
  const result=await userCollection2.insertOne(products);
  res.send(result);
})

 //fetch products

 app.get("/products",async(req,res)=>{
  const query=userCollection2.find();
  console.log(query);
  const result=await query.toArray();
  res.send(result);
 // res.send("yes users");
})

//fetch by id
app.get("/products/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result= await userCollection2.findOne(query).toArray();
  console.log(query);
  res.send(result);
 // res.send("yes users");
})

//fetch by category
app.get("/productsBycategory/:id",async(req,res)=>{
  const id=req.params.id;
  const query={categoryId:id};
  const result=  userCollection2.find(query);
  const datafinal= await result.toArray();
  console.log(result);
  res.send(datafinal);
 // res.send("yes users");
})

//update products
app.put("/products/:id", async (req, res) => {
  const id = req.params.id;
  const product = req.body;
  const filter = { _id: new ObjectId(id) };
  const option = { upsert: true };
  console.log(product);
  const updatedProduct = {
    $set: {
      categoryId: product.categoryId,
      category: product.category,
      productName: product.productName,
      resalePrice: product.resalePrice,
      image: product.image,
      description: product.description,
      status: product.status,
      postingTime: product.postingTime,
    },
  };

  const result = await userCollection2.updateOne(
    filter,
    updatedProduct,
    option
  );
  res.send(result);
});
// delete product
app.delete("/products/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:new ObjectId(id)};
  const result= await userCollection2.deleteOne(query);
  console.log(query);
  res.send(result);
 // res.send("yes users");
})

// add user buy history 
app.post("/userBuyproducts",async(req,res)=>{
  const buyProducts=req.body;
  console.log(buyProducts);
  const result=await userCollection3.insertOne(buyProducts);
  res.send(result);
})
// get user buy history 
app.get("/userBuyproducts/:uid",async(req,res)=>{
  const id=req.params.uid;
  const query={uid:id};
  const result=  userCollection3.find(query);
  const datafinal= await result.toArray();
  res.send(datafinal);
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
   // await client.close();
  }
}

app.get("/",(req,res)=>{
  res.send("Bootcamp react node crud is running oo2o");
}
);

app.get("/test",(req,res)=>{
  res.send("test only 12");
}
);
app.listen(port, ()=>{
  console.log(`Bootcamp react node crud is running on ${port}`);
})


run().catch(console.dir);
