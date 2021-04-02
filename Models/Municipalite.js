const mongoose = require('mongoose');

const municipalite = new mongoose.Schema({
    Nom: {
      type: String
    },
  },{timestamps:true})
  
  const User = mongoose.model('municipalites', municipalite);
  module.exports = User