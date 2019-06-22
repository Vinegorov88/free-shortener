let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  userId: String,
  url: String,
  key: String,
  date: String,
  hour: String,
  visits: [{}]
});

let Url = mongoose.model('Url', schema);
module.exports = Url;