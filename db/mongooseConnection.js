const mongoose = require('mongoose');
const uri = "mongodb+srv://vampirerachel:homeworkhomework@cluster0.ma9fyeg.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Database connection successful');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

module.exports = mongoose;