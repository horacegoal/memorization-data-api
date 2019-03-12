const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser')
const cors = require('cors');
let words = fs.readFileSync('./server/words.json');
let data = JSON.parse(words);


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
  response.send(data);
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

  fs.writeFile('words.json', JSON.stringify(data, null, 2), (err) => {
    if(err){
      console.log(err)
    }else{
      console.log(category, name, 'added');
      response.send({
        category: category,
        name: name
      })
    }
  })
})
