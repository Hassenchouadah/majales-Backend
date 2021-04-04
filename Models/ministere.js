const mongoose = require('mongoose');

const ministere = new mongoose.Schema({
    Nom: {
      type: String
    },
  },{timestamps:true})
  
  const Ministere = mongoose.model('ministeres', ministere);
  module.exports = Ministere