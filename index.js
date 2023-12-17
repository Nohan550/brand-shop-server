const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    // await client.connect();
    const database = client.db("brandsDB");
    const products = database.collection("brands");

    const cartDB = client.db("cartDB");
    const prods = cartDB.collection("cart");

    app.get("/brands", async (req, res) => {
      const cursor = products.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brands/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await products.findOne(query);
      res.send(product);
    });

    app.post("/brands", async (req, res) => {
      const product = req.body;
      
      const result = await products.insertOne(product);
      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const prod = req.body;
      // console.log(product);
      const result = await prods.insertOne(prod);
      res.send(result);
    });

    app.get("/cart", async (req, res) => {
      const cursor = prods.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/cart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const prod = await prods.findOne(query);
      res.send(prod);
    });


     app.put("/brands/:id",async(req,res)=>{
      const id = req.params.id;
      const prod = req.body;
      console.log(id,prod)
      const filter = {_id: new ObjectId(id)};
      const options = {upsert:true};
      const updatedProd ={
        $set:{
             name:prod.name,
             image:prod.image,
             brand_name:prod.brand_name,
             type:prod.type,
             rating:prod.rating,
             price:prod.price
        }
      }

      const result =await products.updateOne(filter,updatedProd,options);
      res.send(result)
     })

    app.delete("/cart/:id", async( req,res)=>{
      const id = req.params.id;
      console.log( id);
      const query = {_id : new ObjectId(id)};
      const result = await prods.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {
  console.log(`server running on ${port}`);
});
