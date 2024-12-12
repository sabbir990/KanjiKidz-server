const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;
const cors = require("cors")
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2btb5w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(express.json());
app.use(cors())

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
    
    const userCollection = client.db("KanjiKidz").collection("users");
    const lessonCollection = client.db("KanjiKidz").collection("lessons");
    const vocabularyCollection = client.db("KanjiKidz").collection("vocabularies");

    app.post('/post_user', async (req, res) => {
      const user = req?.body;
      const query = { email: user?.email };
      const isExists = await userCollection.findOne(query);

      if (isExists) {
        return res.send(isExists);
      }

      const result = await userCollection.insertOne(user);
      res.send(result)
    })

    app.get('/my_data/:email', async(req, res) => {
      const email = req?.params?.email;
      const query = {email : email};
      const result = await userCollection.findOne(query);
      res.send(result);
    })

    app.get('/all_users', async(req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    })

    app.patch('/update_role/:id', async(req, res) => {
      const id = req?.params?.id;
      const role = req?.body;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updateDoc = {
        $set : {
          role : role?.role
        }
      }

      const result = await userCollection.updateOne(filter, updateDoc, options)
      res.send(result);
    })

    app.post('/add_lesson', async(req, res) => {
      const lesson = req?.body;
      const result = await lessonCollection.insertOne(lesson);
      res.send(result);
    } )

    app.get('/all_lessons', async(req, res) => {
      const result = await lessonCollection.find().toArray();
      res.send(result);
    })

    app.get('/single_lesson/:id', async(req, res) => {
      const id = req?.params?.id;
      const query = {_id : new ObjectId(id)};
      const result = await lessonCollection.findOne(query);
      res.send(result);
    })

    app.patch('/update_lesson/:id', async(req, res) => {
      const id = req?.params?.id;
      const lesson = req?.body;
      const filter = {_id : new ObjectId(id)};
      const options = {upsert : true};
      const updatedDoc = {
        $set : {
          ...lesson
        }
      }

      const result = await lessonCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    app.delete('/delete_lesson/:id', async(req, res) => {
      const id = req?.params?.id;
      const query = {_id : new ObjectId(id)};
      const result = await lessonCollection.deleteOne(query);
      res.send(result);
    })

    app.post('/add_vocabulary', async(req, res) => {
      const vocabulary = req?.body;
      const result = await vocabularyCollection.insertOne(vocabulary);
      res.send(result);
    })
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("This is a task from my sensei and the best learning platform of my life Programming Hero")
})

app.listen(PORT, () => {
  console.log(`This server is running in port ${PORT}`)
})