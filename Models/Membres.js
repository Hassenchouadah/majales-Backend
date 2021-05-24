const mongoose = require('mongoose');
require('./Municipalite');
const Schema = mongoose.Schema;

const membre = new mongoose.Schema({
  nom: {
    type: String
  },
  prenom: {
    type: String
  },
  nom_pere: {
    type: String
  },
  sexe: {
    type: String
  },
  etat_civil: {
    type: String
  },
  problemes_physique: {
    type: String
  },
  CIN: {
    type: String
  },
  adresse: {
    type: String
  },
  portable: {
    type: String
  },
  fix: {
    type: String
  },
  niveau_academique: {
    type: String
  },
  specialite: {
    type: String
  },
  diplome: {
    type: String
  },
  annee_obtention: {
    type: String
  },
  municipalite: {
    type: Schema.ObjectId,
    ref: 'municipalites'
  },

  secteur: {
    type: String
  },
  grade: {
    type: String
  },
  poste: {
    type: String
  },
  num_cnss: {
    type: String
  },
  is_active: {
    type: Boolean
  },


  appartenance: {
    type: Boolean
  },
  nom_partie: {
    type: String
  },  
  description_conseil: {
    type: String
  },

  
},{timestamps:true})

const Membre = mongoose.model('membres', membre);
module.exports = Membre