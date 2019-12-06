const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('dist'));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
})

app.listen(port, () => console.log(`listening from port: ${port}`));