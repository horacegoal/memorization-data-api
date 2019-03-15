const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let db;

const connectionURL = process.env.MONGODBATLAS_URI;
const databaseName = 'Words';

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (err, client) => {
  if(err){
    return console.log('unable to connect to database')
  }
  console.log('database connected')
  db = client.db(databaseName)

})



const app = express();
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath))
app.use(bodyParser.json());
app.use(cors());

let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('port is on 3000');
})

app.get('/all', (request, response) => {
  let list = db.listCollections().toArray();
  // let allData = {a: 1};
  let collectionList = []
  list
  .then((res) => {
    res.forEach((collection) => {
      collectionList.push(collection.name)
    })
    return new Promise((resolve, reject) => {
      if(collectionList.length === res.length){
        resolve(collectionList)
      }
    })
  })
  .then((collectionList) => {
    let allData = {};
    collectionList.forEach((collectionName) => {
      let cursor = db.collection(collectionName).find({},{projection:{ _id: 0}});
      let doc = cursor.toArray();
      doc.then((res) => {
        allData[collectionName] = res;
      })
    })
    setTimeout(() => {
      response.send(allData)
    }, 1000)
  })

})


app.post('/add', (request, response) => {
  let category = request.body.category;
  let name = request.body.name;
  if(data[category]){
    data[category][name] = true
  }else{
    data[category] = {
      [name]: true
    }
  }

  let existed = false;
  let collections = db.listCollections();
    collections.toArray((err, res) => {
      if(err){
        return console.log(err)
      }
      res.forEach((collection) => {
        if(collection.name === category){

          existed = true;
          db.collection(category).updateOne({}, {$set: {[name]: category}})
          response.send(category, name, 'added');

        }

      })
      if(!existed){
        db.collection(category).insertOne({
          [name]: category
        }, (err, res) => {
          if(err) {
            return console.log('unable to insert data');
          }
          console.log(res.ops)
          response.send(category, name, 'added');
        })
      }
    })


})
