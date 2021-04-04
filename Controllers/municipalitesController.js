const express = require('express');
const mongoose = require('mongoose');
const Municipalites = require('../Models/Municipalite')

const route = express.Router();

//show Municipalites list
const index = (req,res,next)  => {
	Municipalites.find()
	.populate([
        {
          path: 'gouvernorat',
		  populate: {
		    path: 'ministere'
		  }
        },
      ])
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Municipalites"
		})
	})
}

//add Municipalite
const addMunicipalite = (req,res,next) => {
	let municipalite = new Municipalites({
		Nom: req.body.nom,
		gouvernorat: req.body.gouvernorat
	})
	municipalite.save()
	.then(response => {
		res.json({
			message:"municipalite Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding municipalite"
		})
	})
}



route.get('/',index)
route.post('/add',addMunicipalite)

module.exports = route;