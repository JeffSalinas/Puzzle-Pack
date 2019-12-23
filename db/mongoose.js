const mongoose = require('mongoose');
const { URI } = require('./config.js');

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;
connection.on('error', console.error.bind(console, 'connection error:'));
connection.once('open', function () {
  console.log('connection successful!');
});

const schema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userName: String,
  seconds: Number,
});

const pandaRace = mongoose.model('user-data', schema);

module.exports = { pandaRace };