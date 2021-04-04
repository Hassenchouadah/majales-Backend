const mongoose = require('mongoose');
require('./Membres');
const Schema = mongoose.Schema;

const participation = new mongoose.Schema({
  membre: {
    type: Schema.ObjectId,
    ref: 'membres'
  }
},{timestamps:true})
const Participation = mongoose.model('participations', participation);
module.exports = {
    ParticipationModel : Participation,
    ParticipationSchema : participation
}