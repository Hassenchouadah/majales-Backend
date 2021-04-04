const mongoose = require('mongoose');
const Participation = require('./participation').ParticipationSchema; 

const reunion = new mongoose.Schema({
    sujet: {
      type: String
    },
    lieu: {
        type: String
    },
    date: {
        type: Date
    },
    duree: {
        type: String
    },
    type: {
        type: String
    },
    participations:[Participation]
  },{timestamps:true})
  
  const Reunion = mongoose.model('reunions', reunion);
  module.exports = Reunion