const dns = require('dns');
dns.setServers(['8.8.8.8']);


const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;



// Middleware
app.use(cors());
app.use(express.json());



// MongoDB connection
const uri = "mongodb+srv://smartdbUser:SmartDeals12345@cluster0.uyoueaf.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect MongoDB
async function run() {
  try {
    await client.connect();

    // Connect to the "sample_mflix" database and access its "movies" collection
    const database = client.db("smart_db");


    //Name
    const productsCollection = database.collection("products");


    //Post Operation
    app.post('/products', async (req, res) => {
      const newProduct = req.body;
      const result = await productsCollection.insertOne(newProduct);
      res.send(result);
    });




    // GET Operation
    app.get('/products', async (req, res) => {
      const result = await productsCollection.find().toArray();
      res.send(result);
    });



    // Get Operation by ID
    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });



    // Delete Operation
    app.delete('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });



    // Patch Operation
    app.patch('/products/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedProduct = {
        $set: {
          name: req.body.name,
          price: req.body.price,
          category: req.body.category,
          brand: req.body.brand
        }
      };
      const result = await productsCollection.updateOne(
        filter,
        updatedProduct
      );
      res.send(result);
    });




    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB connected successfully ping!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run();

// Root route
app.get('/', (req, res) => {
  res.send('Smart Deals Server is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});