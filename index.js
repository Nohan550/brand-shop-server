const express = require('express');
const cors =require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 8900;


const app = express();
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yus1g0f.mongodb.net/?retryWrites=true&w=majority`;

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
           const database =client.db("brandsDB");
           const products = database.collection("brands")

   app.get("/brands", async(req,res) =>{
    const cursor = products.find() ;
    const result = await cursor.toArray() ;
    res.send(result) 
   } ) 

   app.post("/brands",async(req,res)=>{
    const product=req.body;
    // console.log(product);
         const result = await products.insertOne(product)
         res.send(result)  
   })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






app.get('/',(req,res) =>{
    res.send('server running')
});

app.listen(port,()=>{
    console.log(`server running on ${port}`)
});