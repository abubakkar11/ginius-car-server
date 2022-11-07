const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASSWORD}@cluster0.b0mkc5r.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    const serviceCollection = client.db('giniusCar').collection('service')
    const orderCollection = client.db('giniusCar').collection('orders')
    app.get('/services', async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const service = await cursor.toArray()
      res.send(service)
    })
    app.get('/services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const cursor = await serviceCollection.findOne(query);
      res.send(cursor)
    })
    app.delete('/orders/:id' ,async(req ,res) =>{
      const id = req.params.id;
      console.log(id)
      const query = {_id : ObjectId(id)};
      console.log(query)
      const result = await orderCollection.deleteOne(query);
      res.send(result)
    })
    app.patch('/orders/:id' , async(req , res) =>{
      const id = req.params.id;
      const status = req.body.status
      const query = {_id : ObjectId(id)};
      const updateDoc = {
        $set:{
          status : status
        }
      }
      const result = await orderCollection.updateOne(query , updateDoc)
      res.send(result)
    })
    app.get('/orders' , async(req , res) =>{
      let query = {};
      if(req.query.email){
        query = {
          email : req.query.email
        }
      }
      const cursor =  orderCollection.find(query)
      const order = await cursor.toArray()
      res.send(order)
    })

    app.post('/orders', async (req, res) => {
      const orders = req.body;
      const order = await orderCollection.insertOne(orders);
      res.send(order)
    })
  }
  finally {

  }

}
run().catch(err => console.error(err))


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})