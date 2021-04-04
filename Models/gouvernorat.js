const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./ministere');

const gouvernorat = new mongoose.Schema({
    Nom: {
      type: String
    },
    ministere: {
      type: Schema.ObjectId,
      ref: 'ministeres'
    }
  },{timestamps:true})
  
  const Gouvernorat = mongoose.model('gouvernorats', gouvernorat);
  module.exports = Gouvernorat