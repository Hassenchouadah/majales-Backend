const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('./gouvernorat');

const municipalite = new mongoose.Schema({
    Nom: {
      type: String
    },
    gouvernorat: {
      type: Schema.ObjectId,
      ref: 'gouvernorats'
    }
  },{timestamps:true})
  
  const Municipalite = mongoose.model('municipalites', municipalite);
  module.exports = Municipalite