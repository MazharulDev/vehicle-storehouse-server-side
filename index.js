const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port=process.env.PORT||5000;
 
const app=express();
 
//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6sagz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const itemCollection=client.db("itemVehicle").collection("item");
        //get item
        app.get('/item',async(req,res)=>{
            const query={};
            const cursor=itemCollection.find(query);
            const items=await cursor.toArray();
            res.send(items);
        })
        //post item
        app.post('/item', async(req,res)=>{
            const newItem=req.body;
            const result=await itemCollection.insertOne(newItem);
            res.send(result)
        })
        // single api
        app.get('/item/:id', async(req,res)=>{
            const id=req.params.id;
            const query={_id: ObjectId(id)};
            const item= await itemCollection.findOne(query);
            res.send(item);
          })
          // update quantity
          app.put('/item/:id',async(req,res)=>{
              const id=req.params.id;
              const updateQuantity=req.body;
              const filter={_id:ObjectId(id)};
              const options={upsert: true};
              const updateDoc={
                  $set:{
                      quantity:updateQuantity.quantityNumber
                  }
              };
              const result=await itemCollection.updateOne(filter,updateDoc,options);
              res.send(result);  
          })
          // delivered quantity
          app.put('/item/:id',async(req,res)=>{
            const id=req.params.id;
            const updateDelivery=req.body;
            const filter={_id:ObjectId(id)};
            const options={upsert: true};
            const updateDoc={
                $set:{
                    quantity:updateDelivery.deliveredQuantity
                }
            };
            const result=await itemCollection.updateOne(filter,updateDoc,options);
            res.send(result);  
        })
    }
    finally{

    }
}
run().catch(console.dir);

 
app.get('/',(req,res)=>{
   res.send('running vehicle storehouse')
})
 
app.listen(port,()=>{
   console.log("Listening to port",port);
})