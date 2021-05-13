const mongoose = require('mongoose');
const Participation = require('./participation').ParticipationSchema; 

const Schema = mongoose.Schema;
require('./Municipalite');

const reunion = new mongoose.Schema({
    sujet: {
      type: String
    },
    municipalite: {
        type: Schema.ObjectId,
        ref: 'municipalites'
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