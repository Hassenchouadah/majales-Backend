const mongoose = require('mongoose');

const admin = new mongoose.Schema({
    username: {
      type: String
    },
    password: {
        type: String
    },
    nom: {
        type: String
    },
    prenom: {
        type: String
    },
    adresse: {
        type: String
    },
    email: {
        type: String
    },
    telephone: {
        type: String
    },
    CIN: {
        type: String
    },
    avatar: {
        type: String
    },
    role: {
        type: String
    },
  },{timestamps:true})
  
  const Admin = mongoose.model('admins', admin);
  module.exports = Admin