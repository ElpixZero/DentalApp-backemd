const mongoose = require('mongoose');

mongoose.connect(`mongodb://localhost: ${process.env.DBPORT}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000
}).then( () => console.log(`Connected to DB on ${process.env.DBPORT} port`)).catch( (err) => {
  throw new Error(err);
});

module.exports = mongoose;