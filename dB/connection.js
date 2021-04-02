const mongoose = require('mongoose');

const URI ="mongodb+srv://dbHsan:Blacknob1998@cluster0.rdwxx.mongodb.net/majales?retryWrites=true&w=majority";
const connectDB = async () => {
  await mongoose.connect(URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });
  console.log('db connected..!');
};

module.exports = connectDB;