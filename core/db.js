const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).catch( (err) => {
  throw new Error(err);
})

module.exports = mongoose;