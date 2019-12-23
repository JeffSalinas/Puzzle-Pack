const express = require('express');
const path = require('path');
const app = express();
const { pandaRace } = require('./db/mongoose.js');
const mongoose = require('mongoose');
const port = 3000;

app.use(express.static('dist'));
app.use(express.json())

app.post('/user', (req, res) => {
  const user = new pandaRace({
    _id: new mongoose.Types.ObjectId(),
    userName: req.body.userName,
    seconds: req.body.seconds
  });
  user.save()
    .then(result => {
      res.status(201).send({
        message: 'handling POST requests to /item',
        createdProduct: result
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

app.get('/users', (req, res) => {
  pandaRace.find()
    .exec()
    .then(doc => {
      let sorted = doc.sort((a, b) => {
        return a.seconds - b.seconds;
      })

      let newFormat = [];

      sorted.forEach(el => {
        let seconds = el.seconds;
        let min = Math.floor(seconds / 60).toString();
        seconds = (seconds % 60).toString();

        if (seconds.length === 1) {
          seconds = '0' + seconds;
        }
        
        newFormat.push({name: el.userName, time: min + ':' + seconds}); 
      });

      res.status(200).send(newFormat);
    })
    .catch(err => {
      res.status(500).end();
    });
});


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(port, () => console.log(`listening from port: ${port}`));