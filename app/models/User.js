let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  username: String,
  password: String,
  email: String,
  date: String,
});

let User = mongoose.model('User', schema);
module.exports = User;